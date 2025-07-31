const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Dummy user data
const dummyUsers = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'USER',
    bio: 'Full-stack developer passionate about modern web technologies',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'USER',
    bio: 'Frontend developer specializing in React and Vue.js',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    password: 'password123',
    role: 'MODERATOR',
    bio: 'Backend engineer with expertise in Node.js and databases',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    password: 'password123',
    role: 'USER',
    bio: 'UI/UX designer turned developer, love creating beautiful interfaces',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'David Brown',
    email: 'david.brown@example.com',
    password: 'password123',
    role: 'USER',
    bio: 'DevOps engineer passionate about automation and cloud technologies',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    password: 'password123',
    role: 'USER',
    bio: 'Mobile app developer working with React Native and Flutter',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Alex Chen',
    email: 'alex.chen@example.com',
    password: 'password123',
    role: 'USER',
    bio: 'Data scientist exploring the intersection of AI and web development',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Lisa Garcia',
    email: 'lisa.garcia@example.com',
    password: 'password123',
    role: 'MODERATOR',
    bio: 'Technical writer and developer advocate',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Tom Anderson',
    email: 'tom.anderson@example.com',
    password: 'password123',
    role: 'USER',
    bio: 'Cybersecurity specialist learning web development',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@example.com',
    password: 'password123',
    role: 'USER',
    bio: 'Product manager with a technical background',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        name: 'Programming',
        slug: 'programming'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'mobile-development' },
      update: {},
      create: {
        name: 'Mobile Development',
        slug: 'mobile-development'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'devops' },
      update: {},
      create: {
        name: 'DevOps',
        slug: 'devops'
      }
    })
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'JavaScript' },
      update: {},
      create: { name: 'JavaScript' }
    }),
    prisma.tag.upsert({
      where: { name: 'Node.js' },
      update: {},
      create: { name: 'Node.js' }
    }),
    prisma.tag.upsert({
      where: { name: 'Express.js' },
      update: {},
      create: { name: 'Express.js' }
    }),
    prisma.tag.upsert({
      where: { name: 'Prisma' },
      update: {},
      create: { name: 'Prisma' }
    }),
    prisma.tag.upsert({
      where: { name: 'React' },
      update: {},
      create: { name: 'React' }
    }),
    prisma.tag.upsert({
      where: { name: 'Vue.js' },
      update: {},
      create: { name: 'Vue.js' }
    }),
    prisma.tag.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: { name: 'TypeScript' }
    }),
    prisma.tag.upsert({
      where: { name: 'Docker' },
      update: {},
      create: { name: 'Docker' }
    })
  ]);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      profile: {
        create: {
          bio: 'System Administrator',
          avatar: 'https://via.placeholder.com/150'
        }
      }
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12);
  
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
      profile: {
        create: {
          bio: 'Just a regular user exploring the platform',
          avatar: 'https://via.placeholder.com/150'
        }
      }
    }
  });

  // Create dummy users
  console.log('👥 Creating dummy users...');
  const createdUsers = [];
  
  for (const userData of dummyUsers) {
    const hashedUserPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: hashedUserPassword,
        role: userData.role,
        profile: {
          create: {
            bio: userData.bio,
            avatar: userData.avatar
          }
        }
      }
    });
    
    createdUsers.push(user);
    console.log(`✅ Created user: ${userData.name} (${userData.email})`);
  }

  // Create sample posts from different users
  console.log('📝 Creating sample posts...');
  
  const samplePosts = [
    {
      title: 'Getting Started with Express.js and Prisma',
      content: 'This is a comprehensive guide on how to set up Express.js with Prisma ORM. We\'ll cover everything from installation to advanced queries...',
      published: true,
      authorId: adminUser.id,
      categoryIds: [categories[1].id, categories[2].id], // Programming, Web Development
      tagIds: [tags[0].id, tags[1].id, tags[2].id, tags[3].id] // JavaScript, Node.js, Express.js, Prisma
    },
    {
      title: 'Building Modern React Applications',
      content: 'Learn how to build scalable React applications with modern tools and best practices. This tutorial covers hooks, context, and performance optimization...',
      published: true,
      authorId: createdUsers[1].id, // Jane Smith
      categoryIds: [categories[2].id], // Web Development
      tagIds: [tags[0].id, tags[4].id, tags[6].id] // JavaScript, React, TypeScript
    },
    {
      title: 'Docker for Developers: A Complete Guide',
      content: 'Master Docker containerization for development and production environments. Learn about images, containers, volumes, and orchestration...',
      published: true,
      authorId: createdUsers[4].id, // David Brown
      categoryIds: [categories[4].id], // DevOps
      tagIds: [tags[7].id] // Docker
    },
    {
      title: 'Mobile App Development with React Native',
      content: 'Create cross-platform mobile applications using React Native. This guide covers navigation, state management, and native module integration...',
      published: false,
      authorId: createdUsers[5].id, // Emily Davis
      categoryIds: [categories[3].id], // Mobile Development
      tagIds: [tags[0].id, tags[4].id] // JavaScript, React
    },
    {
      title: 'Vue.js vs React: A Developer\'s Perspective',
      content: 'An in-depth comparison of Vue.js and React frameworks. We\'ll explore their strengths, weaknesses, and use cases...',
      published: true,
      authorId: createdUsers[1].id, // Jane Smith
      categoryIds: [categories[2].id], // Web Development
      tagIds: [tags[0].id, tags[4].id, tags[5].id] // JavaScript, React, Vue.js
    }
  ];

  for (const postData of samplePosts) {
    await prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        published: postData.published,
        authorId: postData.authorId,
        categories: {
          create: postData.categoryIds.map(categoryId => ({
            categoryId
          }))
        },
        tags: {
          create: postData.tagIds.map(tagId => ({
            tagId
          }))
        }
      }
    });
    console.log(`✅ Created post: ${postData.title}`);
  }

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n👤 Default Users:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   User: user@example.com / user123');
  console.log('\n👥 Dummy Users (all with password: password123):');
  dummyUsers.forEach(user => {
    console.log(`   ${user.role}: ${user.email}`);
  });
  console.log('\n📊 Summary:');
  console.log(`   Users: ${dummyUsers.length + 2} total`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Tags: ${tags.length}`);
  console.log(`   Posts: ${samplePosts.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });