const bcrypt = require('bcryptjs');
const prisma = require('../config/database');
const AppError = require('../utils/AppError');

const getAllUsers = async ({ page = 1, limit = 10, search, role }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);
  
  const where = {
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }),
    ...(role && { role })
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            bio: true,
            avatar: true
          }
        },
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return {
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page)
  };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          bio: true,
          avatar: true
        }
      },
      posts: {
        select: {
          id: true,
          title: true,
          published: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const createUser = async (userData) => {
  const { email, password, name, bio, avatar } = userData;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user with profile in a transaction
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      ...(bio || avatar ? {
        profile: {
          create: {
            bio,
            avatar
          }
        }
      } : {})
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      profile: {
        select: {
          bio: true,
          avatar: true
        }
      }
    }
  });

  return user;
};

const updateUser = async (id, userData) => {
  const { name, bio, avatar, role } = userData;
  
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  // Update user and profile in a transaction
  const updatedUser = await prisma.$transaction(async (tx) => {
    // Update user
    const user = await tx.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(role && { role })
      }
    });

    // Update or create profile if bio or avatar provided
    if (bio !== undefined || avatar !== undefined) {
      await tx.profile.upsert({
        where: { userId: parseInt(id) },
        update: {
          ...(bio !== undefined && { bio }),
          ...(avatar !== undefined && { avatar })
        },
        create: {
          userId: parseInt(id),
          bio: bio || null,
          avatar: avatar || null
        }
      });
    }

    return user;
  });

  // Fetch updated user with profile
  return await getUserById(id);
};

const deleteUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Soft delete by setting isActive to false
  await prisma.user.update({
    where: { id: parseInt(id) },
    data: { isActive: false }
  });

  return true;
};

const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      profile: true
    }
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail
};