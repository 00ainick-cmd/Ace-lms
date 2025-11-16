import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create sample student user
  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      name: 'Sample Student',
      role: 'student',
    },
  });
  console.log('✅ Created student user:', student.email);

  // Create CAET Foundations course
  const course = await prisma.course.create({
    data: {
      title: 'CAET Foundations',
      description: 'Complete foundational training for CAET (Computer-Aided Engineering Technology)',
    },
  });
  console.log('✅ Created course:', course.title);

  // Define 8 CAET topics
  const topics = [
    {
      title: 'Introduction to CAET',
      description: 'Overview of Computer-Aided Engineering Technology and its applications in modern engineering',
    },
    {
      title: 'Engineering Fundamentals',
      description: 'Core engineering principles and mathematical foundations for CAET',
    },
    {
      title: 'CAD Systems',
      description: 'Introduction to Computer-Aided Design software and 3D modeling techniques',
    },
    {
      title: 'Simulation and Analysis',
      description: 'Finite element analysis and engineering simulation methodologies',
    },
    {
      title: 'Data Management',
      description: 'Engineering data management, version control, and collaboration tools',
    },
    {
      title: 'Automation and Scripting',
      description: 'Automation techniques and scripting for engineering workflows',
    },
    {
      title: 'Project Management',
      description: 'Engineering project management principles and best practices',
    },
    {
      title: 'Industry Applications',
      description: 'Real-world applications and case studies from various engineering domains',
    },
  ];

  // Create topics and lessons
  const createdLessons: string[] = [];

  for (let i = 0; i < topics.length; i++) {
    const topic = await prisma.topic.create({
      data: {
        courseId: course.id,
        title: topics[i].title,
        description: topics[i].description,
        order: i + 1,
      },
    });
    console.log(`✅ Created topic ${i + 1}:`, topic.title);

    // Create one sample lesson for each topic
    const lesson = await prisma.lesson.create({
      data: {
        topicId: topic.id,
        title: `${topics[i].title} - Module 1`,
        githubUrl: `https://your-github-username.github.io/caet/module-${i + 1}`,
        order: 1,
      },
    });
    createdLessons.push(lesson.id);
    console.log(`  ✅ Created lesson:`, lesson.title);
  }

  // Create enrollment for the student
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
      status: 'active',
    },
  });
  console.log('✅ Created enrollment for student');

  // Create progress records for each lesson with "not_started" status
  for (const lessonId of createdLessons) {
    await prisma.progress.create({
      data: {
        userId: student.id,
        lessonId: lessonId,
        status: 'not_started',
      },
    });
  }
  console.log(`✅ Created ${createdLessons.length} progress records for student`);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\nSummary:');
  console.log(`- Users: 2 (1 admin, 1 student)`);
  console.log(`- Courses: 1`);
  console.log(`- Topics: ${topics.length}`);
  console.log(`- Lessons: ${createdLessons.length}`);
  console.log(`- Enrollments: 1`);
  console.log(`- Progress records: ${createdLessons.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
