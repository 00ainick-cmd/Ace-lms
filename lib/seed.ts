// Seed script for Ace LMS
import bcrypt from 'bcryptjs';
import { initDatabase } from './db';
import {
  userRepository,
  courseRepository,
  topicRepository,
  lessonRepository,
  enrollmentRepository,
} from './repositories';

export async function seedDatabase() {
  // Initialize database schema
  initDatabase();

  console.log('Seeding database...');

  // Check if already seeded
  const existingUsers = userRepository.findAll();
  if (existingUsers.length > 0) {
    console.log('Database already seeded!');
    return;
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = userRepository.create({
    name: 'Admin User',
    email: 'admin@acelms.com',
    password: adminPassword,
    role: 'ADMIN',
  });
  console.log('Created admin user:', admin.email);

  // Create sample students
  const studentPassword = await bcrypt.hash('student123', 10);
  const student1 = userRepository.create({
    name: 'John Smith',
    email: 'john@student.com',
    password: studentPassword,
    role: 'STUDENT',
  });
  const student2 = userRepository.create({
    name: 'Jane Doe',
    email: 'jane@student.com',
    password: studentPassword,
    role: 'STUDENT',
  });
  console.log('Created sample students');

  // Create CAET Foundations course
  const caetCourse = courseRepository.create({
    title: 'CAET Foundations',
    description:
      'Comprehensive Computer and Avionics Electronics Technology training program covering essential topics from maintenance regulations to digital electronics and communication systems.',
  });
  console.log('Created CAET Foundations course');

  // Define course topics
  const topics = [
    {
      title: 'Maintenance Regulations and Forms',
      description: 'Understanding aviation maintenance regulations, documentation, and compliance requirements.',
      lessons: [
        { title: 'FAA Regulations Overview', githubUrl: 'https://example.com/caet/topic1/lesson1' },
        { title: 'Maintenance Documentation', githubUrl: 'https://example.com/caet/topic1/lesson2' },
        { title: 'Compliance and Safety Standards', githubUrl: 'https://example.com/caet/topic1/lesson3' },
      ],
    },
    {
      title: 'Aircraft Handling and Safety',
      description: 'Safety procedures, human factors, and best practices for aircraft handling.',
      lessons: [
        { title: 'Ground Handling Procedures', githubUrl: 'https://example.com/caet/topic2/lesson1' },
        { title: 'Human Factors in Aviation', githubUrl: 'https://example.com/caet/topic2/lesson2' },
        { title: 'Safety Protocols and Emergency Procedures', githubUrl: 'https://example.com/caet/topic2/lesson3' },
      ],
    },
    {
      title: 'Fundamentals of DC',
      description: 'Direct current electrical theory, circuits, and applications.',
      lessons: [
        { title: 'DC Circuit Theory', githubUrl: 'https://example.com/caet/topic3/lesson1' },
        { title: 'Ohms Law and Power Calculations', githubUrl: 'https://example.com/caet/topic3/lesson2' },
        { title: 'Series and Parallel Circuits', githubUrl: 'https://example.com/caet/topic3/lesson3' },
        { title: 'DC Troubleshooting', githubUrl: 'https://example.com/caet/topic3/lesson4' },
      ],
    },
    {
      title: 'Fundamentals of AC and Semiconductors',
      description: 'Alternating current principles and semiconductor devices.',
      lessons: [
        { title: 'AC Circuit Theory', githubUrl: 'https://example.com/caet/topic4/lesson1' },
        { title: 'Inductance and Capacitance', githubUrl: 'https://example.com/caet/topic4/lesson2' },
        { title: 'Semiconductor Devices', githubUrl: 'https://example.com/caet/topic4/lesson3' },
        { title: 'Power Supplies and Rectifiers', githubUrl: 'https://example.com/caet/topic4/lesson4' },
      ],
    },
    {
      title: 'Aircraft Electrical System',
      description: 'Aircraft electrical power generation, distribution, and protection systems.',
      lessons: [
        { title: 'Aircraft Power Generation', githubUrl: 'https://example.com/caet/topic5/lesson1' },
        { title: 'Electrical Distribution Systems', githubUrl: 'https://example.com/caet/topic5/lesson2' },
        { title: 'Circuit Protection Devices', githubUrl: 'https://example.com/caet/topic5/lesson3' },
        { title: 'Battery Systems', githubUrl: 'https://example.com/caet/topic5/lesson4' },
      ],
    },
    {
      title: 'Aircraft Wiring',
      description: 'Wire types, installation practices, and troubleshooting techniques.',
      lessons: [
        { title: 'Wire Types and Specifications', githubUrl: 'https://example.com/caet/topic6/lesson1' },
        { title: 'Wiring Installation Practices', githubUrl: 'https://example.com/caet/topic6/lesson2' },
        { title: 'Connectors and Terminals', githubUrl: 'https://example.com/caet/topic6/lesson3' },
        { title: 'Wire Troubleshooting and Repair', githubUrl: 'https://example.com/caet/topic6/lesson4' },
      ],
    },
    {
      title: 'Digital Electronics',
      description: 'Digital logic, microprocessors, and digital systems in aviation.',
      lessons: [
        { title: 'Digital Logic Fundamentals', githubUrl: 'https://example.com/caet/topic7/lesson1' },
        { title: 'Boolean Algebra and Logic Gates', githubUrl: 'https://example.com/caet/topic7/lesson2' },
        { title: 'Microprocessor Basics', githubUrl: 'https://example.com/caet/topic7/lesson3' },
        { title: 'Digital Troubleshooting', githubUrl: 'https://example.com/caet/topic7/lesson4' },
      ],
    },
    {
      title: 'Communication, Navigation, Surveillance Systems',
      description: 'Aircraft avionics systems including communication, navigation, and surveillance.',
      lessons: [
        { title: 'Communication Systems Overview', githubUrl: 'https://example.com/caet/topic8/lesson1' },
        { title: 'Navigation Systems (VOR, GPS, ILS)', githubUrl: 'https://example.com/caet/topic8/lesson2' },
        { title: 'Surveillance Systems (Transponders, ADS-B)', githubUrl: 'https://example.com/caet/topic8/lesson3' },
        { title: 'Avionics Integration', githubUrl: 'https://example.com/caet/topic8/lesson4' },
        { title: 'Troubleshooting CNS Systems', githubUrl: 'https://example.com/caet/topic8/lesson5' },
      ],
    },
  ];

  // Create topics and lessons
  topics.forEach((topicData, topicIndex) => {
    const topic = topicRepository.create({
      courseId: caetCourse.id,
      title: topicData.title,
      description: topicData.description,
      order: topicIndex + 1,
    });

    topicData.lessons.forEach((lessonData, lessonIndex) => {
      lessonRepository.create({
        topicId: topic.id,
        title: lessonData.title,
        githubUrl: lessonData.githubUrl,
        order: lessonIndex + 1,
      });
    });

    console.log(`Created topic: ${topicData.title} with ${topicData.lessons.length} lessons`);
  });

  // Enroll students in the course
  enrollmentRepository.create({ userId: student1.id, courseId: caetCourse.id });
  enrollmentRepository.create({ userId: student2.id, courseId: caetCourse.id });
  console.log('Enrolled students in CAET Foundations');

  console.log('Database seeded successfully!');
  console.log('\nLogin credentials:');
  console.log('Admin: admin@acelms.com / admin123');
  console.log('Student 1: john@student.com / student123');
  console.log('Student 2: jane@student.com / student123');
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
