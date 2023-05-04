const passport = require('passport');
const verifyCallback = require('../utils/authVerifyCallback.util');
const { tokenService, userService } = require('../services');
const userModel = require('../models').User;

const wsAuth = (...requiredRights) => async (ws, req, next) => {
  try {
    const token = req.query.access_token;
    if (!token) {
      throw new Error('no access_token provided.');
    }
    const tokenPayload = await tokenService.verifyAccessToken(token);
    if (!tokenPayload) {
      throw new Error('token invalid');
    }
    req.userId = tokenPayload.sub;
    next();
    const user = await userModel.findById(tokenPayload.sub);
    verifyCallback(
      req,
      _ => {},
      _ => {
        ws.send('authorization failed');
        ws.close();
      },
      requiredRights
    )(null, user, null);
  } catch (err) {
    ws.send(err.toString());
    ws.close();
  }
};

module.exports = wsAuth;
