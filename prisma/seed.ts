import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      name: 'Test Student',
      password: hashedPassword,
      role: 'student',
    },
  });

  // Create sample course
  const course = await prisma.course.create({
    data: {
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development with HTML, CSS, and JavaScript.',
      topics: {
        create: [
          {
            title: 'HTML Basics',
            description: 'Learn the building blocks of web pages',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'HTML Structure',
                  description: 'Understanding the basic structure of HTML documents',
                  githubUrl: 'https://www.example.com/lesson1',
                  order: 1,
                },
                {
                  title: 'HTML Elements',
                  description: 'Common HTML elements and their usage',
                  githubUrl: 'https://www.example.com/lesson2',
                  order: 2,
                },
              ],
            },
          },
          {
            title: 'CSS Fundamentals',
            description: 'Style your web pages with CSS',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'CSS Selectors',
                  description: 'Learn how to select elements with CSS',
                  githubUrl: 'https://www.example.com/lesson3',
                  order: 1,
                },
                {
                  title: 'CSS Box Model',
                  description: 'Understanding the CSS box model',
                  githubUrl: 'https://www.example.com/lesson4',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Create another course
  await prisma.course.create({
    data: {
      title: 'JavaScript Mastery',
      description: 'Master JavaScript from basics to advanced concepts.',
      topics: {
        create: [
          {
            title: 'JavaScript Basics',
            description: 'Get started with JavaScript',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Variables and Data Types',
                  description: 'Understanding JavaScript variables',
                  githubUrl: 'https://www.example.com/js-lesson1',
                  order: 1,
                },
                {
                  title: 'Functions',
                  description: 'Working with JavaScript functions',
                  githubUrl: 'https://www.example.com/js-lesson2',
                  order: 2,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully!');
  console.log('Test user credentials:');
  console.log('Email: student@test.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
