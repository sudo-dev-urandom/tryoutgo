const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token }
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, token }
  });
});

const logout = asyncHandler(async (req, res) => {
  // Implement logout logic (e.g., blacklist token)
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const { token } = await authService.refreshToken(refreshToken);
  
  res.status(200).json({
    success: true,
    data: { token }
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  
  res.status(200).json({
    success: true,
    message: 'Password reset email sent'
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  
  res.status(200).json({
    success: true,
    message: 'Password reset successful'
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
};