const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { User } = require('../models');

const cookieExtractor = function(req) {
  let token = null;
  // eslint-disable-next-line no-console
  console.log(req.cookies);
  if (req && req.cookies) token = req.cookies.access_token;
  // eslint-disable-next-line no-console
  console.log({ token });
  return token;
};

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: cookieExtractor,
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
