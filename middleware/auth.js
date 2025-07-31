const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const config = require('../config/config');

const auth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized to access this route', 401);
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new AppError('Not authorized to access this route', 401);
  }
});

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('Not authorized to access this route', 403);
    }
    next();
  };
};

module.exports = { auth, authorize };