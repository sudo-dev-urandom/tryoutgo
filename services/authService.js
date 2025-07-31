const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const config = require('../config/config');
const AppError = require('../utils/AppError');

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });
};

const register = async (userData) => {
  const { email, password, name } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, parseInt(config.BCRYPT_ROUNDS));

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  // Generate token
  const token = generateToken(user.id);

  return { user, token };
};

const login = async (email, password) => {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: {
        select: {
          bio: true,
          avatar: true
        }
      }
    }
  });

  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate token
  const token = generateToken(user.id);

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isActive: true }
    });

    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401);
    }

    const token = generateToken(user.id);
    return { token };
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
};

const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    // Don't reveal if user exists or not
    return;
  }

  // Generate reset token (implement your email service here)
  const resetToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
    expiresIn: '1h'
  });

  // In a real app, you would send this token via email
  console.log(`Password reset token for ${email}: ${resetToken}`);
};

const resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, parseInt(config.BCRYPT_ROUNDS));

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword }
    });
  } catch (error) {
    throw new AppError('Invalid or expired reset token', 400);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword
};