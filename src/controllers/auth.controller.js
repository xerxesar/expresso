const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, emailService } = require('../services');

const TOKEN_MAX_AGE = 604800000; // 7 days
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await authService.generateAuthTokens(user.id);
  const response = { user: user.transform(), tokens };
  res.status(httpStatus.CREATED).send(response);
});

const login = catchAsync(async (req, res) => {
  const user = await authService.loginUser(req.body.username, req.body.password);
  const tokens = await authService.generateAuthTokens(user.id);
  const response = { user: user.transform(), tokens };
  res.cookie('access_token', tokens.access.token, { httpOnly: true, secure: true, maxAge: TOKEN_MAX_AGE });
  res.cookie('refresh_token', tokens.refresh.token, { httpOnly: true, secure: true, maxAge: TOKEN_MAX_AGE });
  res.send(response);
});

const logout = catchAsync(async (req, res) => {
  res.cookie('access_token', null, { httpOnly: true, secure: true, maxAge: -1 });
  res.cookie('refresh_token', null, { httpOnly: true, secure: true, maxAge: -1 });
  res.status(200).send({ message: 'logget out successfuly' });
});

const refreshTokens = catchAsync(async (req, res) => {
  const response = await authService.refreshAuthTokens(req.cookies.refresh_token);
  const { tokens } = response;
  res.cookie('access_token', tokens.access.token, { httpOnly: true, secure: true, maxAge: TOKEN_MAX_AGE });
  res.cookie('refresh_token', tokens.refresh.token, { httpOnly: true, secure: true, maxAge: TOKEN_MAX_AGE });
  res.send(response);
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await authService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
