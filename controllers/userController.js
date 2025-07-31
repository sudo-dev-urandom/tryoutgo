const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const userService = require('../services/userService');

const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const users = await userService.getAllUsers({ page, limit, search });
  
  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.updateUser(id, req.body);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};