import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@acelms.com' },
    update: {},
    create: {
      email: 'admin@acelms.com',
      name: 'Admin User',
      role: 'admin',
    },
  })
  console.log('Created admin:', admin.email)

  // Create students
  const student1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'student',
    },
  })

  const student2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: 'student',
    },
  })

  const student3 = await prisma.user.upsert({
    where: { email: 'bob.wilson@example.com' },
    update: {},
    create: {
      email: 'bob.wilson@example.com',
      name: 'Bob Wilson',
      role: 'student',
    },
  })

  console.log('Created students:', [student1.email, student2.email, student3.email])

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-1' },
    update: {},
    create: {
      id: 'course-1',
      title: 'CAET Foundations',
      description: 'Introduction to Computer-Aided Engineering Technology',
    },
  })

  const course2 = await prisma.course.upsert({
    where: { id: 'course-2' },
    update: {},
    create: {
      id: 'course-2',
      title: 'Web Development Fundamentals',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
    },
  })

  console.log('Created courses:', [course1.title, course2.title])

  // Create topics for CAET Foundations
  const topic1 = await prisma.topic.upsert({
    where: { id: 'topic-1' },
    update: {},
    create: {
      id: 'topic-1',
      title: 'Introduction to Engineering',
      description: 'Basic engineering concepts',
      order: 1,
      courseId: course1.id,
    },
  })

  const topic2 = await prisma.topic.upsert({
    where: { id: 'topic-2' },
    update: {},
    create: {
      id: 'topic-2',
      title: 'CAD Software Basics',
      description: 'Getting started with CAD',
      order: 2,
      courseId: course1.id,
    },
  })

  // Create topics for Web Development
  const topic3 = await prisma.topic.upsert({
    where: { id: 'topic-3' },
    update: {},
    create: {
      id: 'topic-3',
      title: 'HTML Essentials',
      description: 'Structure web pages with HTML',
      order: 1,
      courseId: course2.id,
    },
  })

  const topic4 = await prisma.topic.upsert({
    where: { id: 'topic-4' },
    update: {},
    create: {
      id: 'topic-4',
      title: 'CSS Styling',
      description: 'Style web pages with CSS',
      order: 2,
      courseId: course2.id,
    },
  })

  console.log('Created topics')

  // Create lessons for Topic 1
  const lesson1 = await prisma.lesson.upsert({
    where: { id: 'lesson-1' },
    update: {},
    create: {
      id: 'lesson-1',
      title: 'What is Engineering?',
      content: 'Introduction to engineering principles',
      order: 1,
      topicId: topic1.id,
    },
  })

  const lesson2 = await prisma.lesson.upsert({
    where: { id: 'lesson-2' },
    update: {},
    create: {
      id: 'lesson-2',
      title: 'Engineering Design Process',
      content: 'Steps in the engineering design process',
      order: 2,
      topicId: topic1.id,
    },
  })

  // Create lessons for Topic 2
  const lesson3 = await prisma.lesson.upsert({
    where: { id: 'lesson-3' },
    update: {},
    create: {
      id: 'lesson-3',
      title: 'CAD Interface Overview',
      content: 'Navigating the CAD interface',
      order: 1,
      topicId: topic2.id,
    },
  })

  const lesson4 = await prisma.lesson.upsert({
    where: { id: 'lesson-4' },
    update: {},
    create: {
      id: 'lesson-4',
      title: 'Basic Drawing Tools',
      content: 'Using basic CAD drawing tools',
      order: 2,
      topicId: topic2.id,
    },
  })

  // Create lessons for Topic 3
  const lesson5 = await prisma.lesson.upsert({
    where: { id: 'lesson-5' },
    update: {},
    create: {
      id: 'lesson-5',
      title: 'HTML Tags and Elements',
      content: 'Understanding HTML structure',
      order: 1,
      topicId: topic3.id,
    },
  })

  const lesson6 = await prisma.lesson.upsert({
    where: { id: 'lesson-6' },
    update: {},
    create: {
      id: 'lesson-6',
      title: 'Forms and Inputs',
      content: 'Creating HTML forms',
      order: 2,
      topicId: topic3.id,
    },
  })

  // Create lessons for Topic 4
  const lesson7 = await prisma.lesson.upsert({
    where: { id: 'lesson-7' },
    update: {},
    create: {
      id: 'lesson-7',
      title: 'CSS Selectors',
      content: 'Understanding CSS selectors',
      order: 1,
      topicId: topic4.id,
    },
  })

  const lesson8 = await prisma.lesson.upsert({
    where: { id: 'lesson-8' },
    update: {},
    create: {
      id: 'lesson-8',
      title: 'Layout with Flexbox',
      content: 'Creating layouts with CSS Flexbox',
      order: 2,
      topicId: topic4.id,
    },
  })

  console.log('Created lessons')

  // Enroll students in courses
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course1.id,
    },
  })

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student1.id,
        courseId: course2.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      courseId: course2.id,
    },
  })

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student2.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      userId: student2.id,
      courseId: course1.id,
    },
  })

  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student3.id,
        courseId: course2.id,
      },
    },
    update: {},
    create: {
      userId: student3.id,
      courseId: course2.id,
    },
  })

  console.log('Created enrollments')

  // Create progress for student1 in course1
  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson1.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson1.id,
      status: 'completed',
      completedAt: new Date('2024-01-15T10:30:00Z'),
    },
  })

  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson2.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson2.id,
      status: 'completed',
      completedAt: new Date('2024-01-16T14:20:00Z'),
    },
  })

  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson3.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson3.id,
      status: 'in_progress',
      completedAt: null,
    },
  })

  // Create progress for student1 in course2
  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson5.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson5.id,
      status: 'completed',
      completedAt: new Date('2024-01-20T09:15:00Z'),
    },
  })

  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson6.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson6.id,
      status: 'completed',
      completedAt: new Date('2024-01-21T11:45:00Z'),
    },
  })

  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson7.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson7.id,
      status: 'completed',
      completedAt: new Date('2024-01-22T16:30:00Z'),
    },
  })

  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student1.id,
        lessonId: lesson8.id,
      },
    },
    update: {},
    create: {
      userId: student1.id,
      lessonId: lesson8.id,
      status: 'in_progress',
      completedAt: null,
    },
  })

  // Create progress for student2 in course1
  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student2.id,
        lessonId: lesson1.id,
      },
    },
    update: {},
    create: {
      userId: student2.id,
      lessonId: lesson1.id,
      status: 'completed',
      completedAt: new Date('2024-01-18T13:00:00Z'),
    },
  })

  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student2.id,
        lessonId: lesson2.id,
      },
    },
    update: {},
    create: {
      userId: student2.id,
      lessonId: lesson2.id,
      status: 'in_progress',
      completedAt: null,
    },
  })

  // Create progress for student3 in course2
  await prisma.progress.upsert({
    where: {
      userId_lessonId: {
        userId: student3.id,
        lessonId: lesson5.id,
      },
    },
    update: {},
    create: {
      userId: student3.id,
      lessonId: lesson5.id,
      status: 'completed',
      completedAt: new Date('2024-01-25T10:00:00Z'),
    },
  })

  console.log('Created progress records')
  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
