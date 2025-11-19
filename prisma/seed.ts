import { PrismaClient, UserRole, SubscriptionType, BadgeCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.userAssessment.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log('✅ Cleaned existing data');

  // Create Companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'CAET Training',
        subscriptionType: SubscriptionType.enterprise,
        seatLimit: 100,
        activeSince: new Date('2024-01-01'),
      },
    }),
    prisma.company.create({
      data: {
        name: 'Tech Solutions Inc',
        subscriptionType: SubscriptionType.professional,
        seatLimit: 50,
        activeSince: new Date('2024-03-15'),
      },
    }),
    prisma.company.create({
      data: {
        name: 'Startup Labs',
        subscriptionType: SubscriptionType.basic,
        seatLimit: 10,
        activeSince: new Date('2024-06-01'),
      },
    }),
  ]);

  console.log('✅ Created companies');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    // Admin users
    prisma.user.create({
      data: {
        email: 'admin@acelms.com',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.admin,
        companyId: companies[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@techsolutions.com',
        passwordHash: hashedPassword,
        firstName: 'Sarah',
        lastName: 'Manager',
        role: UserRole.admin,
        companyId: companies[1].id,
      },
    }),
    // Student users
    prisma.user.create({
      data: {
        email: 'john.doe@acelms.com',
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.student,
        companyId: companies[0].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@techsolutions.com',
        passwordHash: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.student,
        companyId: companies[1].id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.wilson@startuplabs.com',
        passwordHash: hashedPassword,
        firstName: 'Bob',
        lastName: 'Wilson',
        role: UserRole.student,
        companyId: companies[2].id,
      },
    }),
  ]);

  console.log('✅ Created users');

  // Create Courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
        category: 'Web Development',
        githubPath: 'caet-training/web-dev-intro',
        orderIndex: 1,
        isPublished: true,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Advanced React Patterns',
        description: 'Master advanced React patterns and best practices for building scalable applications.',
        category: 'Frontend',
        githubPath: 'caet-training/advanced-react',
        orderIndex: 2,
        isPublished: true,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Node.js Backend Development',
        description: 'Build robust backend services with Node.js, Express, and databases.',
        category: 'Backend',
        githubPath: 'caet-training/nodejs-backend',
        orderIndex: 3,
        isPublished: true,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Database Design & SQL',
        description: 'Learn database design principles and SQL query optimization.',
        category: 'Database',
        githubPath: 'caet-training/database-sql',
        orderIndex: 4,
        isPublished: true,
      },
    }),
    prisma.course.create({
      data: {
        title: 'DevOps Fundamentals',
        description: 'Introduction to DevOps practices, CI/CD, and cloud deployment.',
        category: 'DevOps',
        githubPath: 'caet-training/devops-intro',
        orderIndex: 5,
        isPublished: false,
      },
    }),
  ]);

  console.log('✅ Created courses');

  // Create Modules
  const modules = await Promise.all([
    // Web Development Course Modules
    prisma.module.create({
      data: {
        courseId: courses[0].id,
        title: 'HTML Basics',
        description: 'Learn HTML structure and semantic elements.',
        githubPath: 'caet-training/web-dev-intro/html-basics',
        orderIndex: 1,
        estimatedMinutes: 45,
      },
    }),
    prisma.module.create({
      data: {
        courseId: courses[0].id,
        title: 'CSS Styling',
        description: 'Master CSS selectors, flexbox, and grid layouts.',
        githubPath: 'caet-training/web-dev-intro/css-styling',
        orderIndex: 2,
        estimatedMinutes: 60,
      },
    }),
    prisma.module.create({
      data: {
        courseId: courses[0].id,
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript variables, functions, and DOM manipulation.',
        githubPath: 'caet-training/web-dev-intro/js-fundamentals',
        orderIndex: 3,
        estimatedMinutes: 90,
      },
    }),
    // React Course Modules
    prisma.module.create({
      data: {
        courseId: courses[1].id,
        title: 'Component Patterns',
        description: 'Learn compound components, render props, and HOCs.',
        githubPath: 'caet-training/advanced-react/component-patterns',
        orderIndex: 1,
        estimatedMinutes: 75,
      },
    }),
    prisma.module.create({
      data: {
        courseId: courses[1].id,
        title: 'State Management',
        description: 'Deep dive into Context, Redux, and Zustand.',
        githubPath: 'caet-training/advanced-react/state-management',
        orderIndex: 2,
        estimatedMinutes: 90,
      },
    }),
    prisma.module.create({
      data: {
        courseId: courses[1].id,
        title: 'Performance Optimization',
        description: 'Learn memoization, code splitting, and lazy loading.',
        githubPath: 'caet-training/advanced-react/performance',
        orderIndex: 3,
        estimatedMinutes: 60,
      },
    }),
    // Node.js Course Modules
    prisma.module.create({
      data: {
        courseId: courses[2].id,
        title: 'Express.js Setup',
        description: 'Set up Express server with routing and middleware.',
        githubPath: 'caet-training/nodejs-backend/express-setup',
        orderIndex: 1,
        estimatedMinutes: 45,
      },
    }),
    prisma.module.create({
      data: {
        courseId: courses[2].id,
        title: 'REST API Design',
        description: 'Design and implement RESTful APIs.',
        githubPath: 'caet-training/nodejs-backend/rest-api',
        orderIndex: 2,
        estimatedMinutes: 60,
      },
    }),
    // Database Course Modules
    prisma.module.create({
      data: {
        courseId: courses[3].id,
        title: 'Database Normalization',
        description: 'Learn 1NF, 2NF, 3NF and database design principles.',
        githubPath: 'caet-training/database-sql/normalization',
        orderIndex: 1,
        estimatedMinutes: 50,
      },
    }),
    prisma.module.create({
      data: {
        courseId: courses[3].id,
        title: 'SQL Queries',
        description: 'Master SELECT, JOIN, and aggregate functions.',
        githubPath: 'caet-training/database-sql/queries',
        orderIndex: 2,
        estimatedMinutes: 75,
      },
    }),
  ]);

  console.log('✅ Created modules');

  // Create Badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'First Steps',
        description: 'Complete your first module',
        pointValue: 10,
        category: BadgeCategory.completion,
        iconClass: 'star',
        requirement: 'Complete 1 module',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Course Completer',
        description: 'Complete an entire course',
        pointValue: 50,
        category: BadgeCategory.completion,
        iconClass: 'trophy',
        requirement: 'Complete all modules in a course',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Week Warrior',
        description: 'Learn for 7 consecutive days',
        pointValue: 30,
        category: BadgeCategory.streak,
        iconClass: 'flame',
        requirement: '7 day learning streak',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Perfect Score',
        description: 'Score 100% on an assessment',
        pointValue: 25,
        category: BadgeCategory.achievement,
        iconClass: 'award',
        requirement: 'Get 100% on any assessment',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'JavaScript Master',
        description: 'Complete all JavaScript modules',
        pointValue: 75,
        category: BadgeCategory.skill,
        iconClass: 'code',
        requirement: 'Complete JavaScript Fundamentals and related modules',
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Quick Learner',
        description: 'Complete 5 modules in one week',
        pointValue: 40,
        category: BadgeCategory.achievement,
        iconClass: 'zap',
        requirement: 'Complete 5 modules within 7 days',
      },
    }),
  ]);

  console.log('✅ Created badges');

  // Create Assessments
  const assessments = await Promise.all([
    prisma.assessment.create({
      data: {
        moduleId: modules[0].id,
        title: 'HTML Basics Quiz',
        description: 'Test your knowledge of HTML fundamentals',
        passingScore: 70,
        timeLimit: 15,
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            question: 'What does HTML stand for?',
            options: [
              'Hyper Text Markup Language',
              'High Tech Modern Language',
              'Hyper Transfer Markup Language',
              'Home Tool Markup Language',
            ],
            correctAnswer: 0,
          },
          {
            id: 2,
            type: 'multiple_choice',
            question: 'Which tag is used for the largest heading?',
            options: ['<h6>', '<h1>', '<heading>', '<head>'],
            correctAnswer: 1,
          },
          {
            id: 3,
            type: 'multiple_choice',
            question: 'Which element is used for creating a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<hyperlink>'],
            correctAnswer: 1,
          },
        ],
      },
    }),
    prisma.assessment.create({
      data: {
        moduleId: modules[2].id,
        title: 'JavaScript Fundamentals Test',
        description: 'Test your JavaScript knowledge',
        passingScore: 75,
        timeLimit: 20,
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            question: 'Which keyword declares a constant in JavaScript?',
            options: ['var', 'let', 'const', 'constant'],
            correctAnswer: 2,
          },
          {
            id: 2,
            type: 'multiple_choice',
            question: 'What is the correct way to select an element by ID?',
            options: [
              'document.getElement("id")',
              'document.getElementById("id")',
              'document.querySelector("#id")',
              'Both B and C',
            ],
            correctAnswer: 3,
          },
          {
            id: 3,
            type: 'multiple_choice',
            question: 'Which array method adds an element to the end?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 0,
          },
          {
            id: 4,
            type: 'multiple_choice',
            question: 'What type of value does typeof null return?',
            options: ['null', 'undefined', 'object', 'string'],
            correctAnswer: 2,
          },
        ],
      },
    }),
    prisma.assessment.create({
      data: {
        moduleId: modules[3].id,
        title: 'React Patterns Assessment',
        description: 'Test your understanding of React component patterns',
        passingScore: 80,
        timeLimit: 25,
        questions: [
          {
            id: 1,
            type: 'multiple_choice',
            question: 'What is a Higher-Order Component (HOC)?',
            options: [
              'A component at the top of the tree',
              'A function that takes a component and returns a new component',
              'A component with more props',
              'A component with state',
            ],
            correctAnswer: 1,
          },
          {
            id: 2,
            type: 'multiple_choice',
            question: 'Which pattern uses a function as children?',
            options: [
              'HOC',
              'Compound Components',
              'Render Props',
              'Controlled Components',
            ],
            correctAnswer: 2,
          },
        ],
      },
    }),
  ]);

  console.log('✅ Created assessments');

  // Create User Progress
  await Promise.all([
    // John Doe's progress
    prisma.userProgress.create({
      data: {
        userId: users[2].id,
        moduleId: modules[0].id,
        completionPercentage: 100,
        timeSpent: 2700, // 45 minutes
        lastAccessed: new Date('2024-11-15'),
      },
    }),
    prisma.userProgress.create({
      data: {
        userId: users[2].id,
        moduleId: modules[1].id,
        completionPercentage: 75,
        timeSpent: 2400, // 40 minutes
        lastAccessed: new Date('2024-11-17'),
      },
    }),
    prisma.userProgress.create({
      data: {
        userId: users[2].id,
        moduleId: modules[2].id,
        completionPercentage: 30,
        timeSpent: 1800, // 30 minutes
        lastAccessed: new Date('2024-11-18'),
      },
    }),
    // Jane Smith's progress
    prisma.userProgress.create({
      data: {
        userId: users[3].id,
        moduleId: modules[0].id,
        completionPercentage: 100,
        timeSpent: 3000,
        lastAccessed: new Date('2024-11-10'),
      },
    }),
    prisma.userProgress.create({
      data: {
        userId: users[3].id,
        moduleId: modules[1].id,
        completionPercentage: 100,
        timeSpent: 3600,
        lastAccessed: new Date('2024-11-12'),
      },
    }),
    prisma.userProgress.create({
      data: {
        userId: users[3].id,
        moduleId: modules[2].id,
        completionPercentage: 100,
        timeSpent: 5400,
        lastAccessed: new Date('2024-11-14'),
      },
    }),
    prisma.userProgress.create({
      data: {
        userId: users[3].id,
        moduleId: modules[3].id,
        completionPercentage: 50,
        timeSpent: 2400,
        lastAccessed: new Date('2024-11-16'),
      },
    }),
    // Bob Wilson's progress
    prisma.userProgress.create({
      data: {
        userId: users[4].id,
        moduleId: modules[0].id,
        completionPercentage: 100,
        timeSpent: 2100,
        lastAccessed: new Date('2024-11-05'),
      },
    }),
  ]);

  console.log('✅ Created user progress');

  // Create User Badges
  await Promise.all([
    prisma.userBadge.create({
      data: {
        userId: users[2].id,
        badgeId: badges[0].id,
        pointsEarned: 10,
        earnedAt: new Date('2024-11-15'),
      },
    }),
    prisma.userBadge.create({
      data: {
        userId: users[3].id,
        badgeId: badges[0].id,
        pointsEarned: 10,
        earnedAt: new Date('2024-11-10'),
      },
    }),
    prisma.userBadge.create({
      data: {
        userId: users[3].id,
        badgeId: badges[1].id,
        pointsEarned: 50,
        earnedAt: new Date('2024-11-14'),
      },
    }),
    prisma.userBadge.create({
      data: {
        userId: users[3].id,
        badgeId: badges[3].id,
        pointsEarned: 25,
        earnedAt: new Date('2024-11-14'),
      },
    }),
    prisma.userBadge.create({
      data: {
        userId: users[4].id,
        badgeId: badges[0].id,
        pointsEarned: 10,
        earnedAt: new Date('2024-11-05'),
      },
    }),
  ]);

  console.log('✅ Created user badges');

  // Create User Assessments
  await Promise.all([
    prisma.userAssessment.create({
      data: {
        userId: users[2].id,
        assessmentId: assessments[0].id,
        score: 67,
        attempts: 1,
        passed: false,
        completedAt: new Date('2024-11-15'),
        answers: [
          { questionId: 1, answer: 0 },
          { questionId: 2, answer: 1 },
          { questionId: 3, answer: 0 },
        ],
      },
    }),
    prisma.userAssessment.create({
      data: {
        userId: users[3].id,
        assessmentId: assessments[0].id,
        score: 100,
        attempts: 1,
        passed: true,
        completedAt: new Date('2024-11-10'),
        answers: [
          { questionId: 1, answer: 0 },
          { questionId: 2, answer: 1 },
          { questionId: 3, answer: 1 },
        ],
      },
    }),
    prisma.userAssessment.create({
      data: {
        userId: users[3].id,
        assessmentId: assessments[1].id,
        score: 75,
        attempts: 2,
        passed: true,
        completedAt: new Date('2024-11-14'),
        answers: [
          { questionId: 1, answer: 2 },
          { questionId: 2, answer: 3 },
          { questionId: 3, answer: 0 },
          { questionId: 4, answer: 2 },
        ],
      },
    }),
    prisma.userAssessment.create({
      data: {
        userId: users[4].id,
        assessmentId: assessments[0].id,
        score: 100,
        attempts: 1,
        passed: true,
        completedAt: new Date('2024-11-05'),
        answers: [
          { questionId: 1, answer: 0 },
          { questionId: 2, answer: 1 },
          { questionId: 3, answer: 1 },
        ],
      },
    }),
  ]);

  console.log('✅ Created user assessments');

  console.log('🎉 Seed completed successfully!');
  console.log(`
Summary:
- ${companies.length} companies
- ${users.length} users
- ${courses.length} courses
- ${modules.length} modules
- ${badges.length} badges
- ${assessments.length} assessments
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
