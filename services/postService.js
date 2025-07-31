const prisma = require('../config/database');
const AppError = require('../utils/AppError');

const getAllPosts = async ({ page = 1, limit = 10, search, published, authorId }) => {
  const skip = (page - 1) * limit;
  const take = parseInt(limit);
  
  const where = {
    ...(published !== undefined && { published: published === 'true' }),
    ...(authorId && { authorId: parseInt(authorId) }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        categories: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.post.count({ where })
  ]);

  return {
    posts,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page)
  };
};

const getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: {
            select: {
              bio: true,
              avatar: true
            }
          }
        }
      },
      categories: {
        include: {
          category: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  return post;
};

const createPost = async (postData, authorId) => {
  const { title, content, published = false, categoryIds = [], tagIds = [] } = postData;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      published,
      authorId: parseInt(authorId),
      categories: {
        create: categoryIds.map(categoryId => ({
          categoryId: parseInt(categoryId)
        }))
      },
      tags: {
        create: tagIds.map(tagId => ({
          tagId: parseInt(tagId)
        }))
      }
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      categories: {
        include: {
          category: true
        }
      },
      tags: {
        include: {
          tag: true
        }
      }
    }
  });

  return post;
};

const updatePost = async (id, postData, userId) => {
  const { title, content, published, categoryIds, tagIds } = postData;

  // Check if post exists and user owns it
  const existingPost = await prisma.post.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingPost) {
    throw new AppError('Post not found', 404);
  }

  if (existingPost.authorId !== parseInt(userId)) {
    throw new AppError('Not authorized to update this post', 403);
  }

  // Update post in transaction
  const updatedPost = await prisma.$transaction(async (tx) => {
    // Update basic post data
    const post = await tx.post.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published })
      }
    });

    // Update categories if provided
    if (categoryIds) {
      await tx.postCategory.deleteMany({
        where: { postId: parseInt(id) }
      });
      
      if (categoryIds.length > 0) {
        await tx.postCategory.createMany({
          data: categoryIds.map(categoryId => ({
            postId: parseInt(id),
            categoryId: parseInt(categoryId)
          }))
        });
      }
    }

    // Update tags if provided
    if (tagIds) {
      await tx.postTag.deleteMany({
        where: { postId: parseInt(id) }
      });
      
      if (tagIds.length > 0) {
        await tx.postTag.createMany({
          data: tagIds.map(tagId => ({
            postId: parseInt(id),
            tagId: parseInt(tagId)
          }))
        });
      }
    }

    return post;
  });

  return await getPostById(id);
};

const deletePost = async (id, userId) => {
  const post = await prisma.post.findUnique({
    where: { id: parseInt(id) }
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  if (post.authorId !== parseInt(userId)) {
    throw new AppError('Not authorized to delete this post', 403);
  }

  await prisma.post.delete({
    where: { id: parseInt(id) }
  });

  return true;
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};