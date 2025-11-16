# AceLMS - CAET Training Platform

A lightweight Learning Management System (LMS) built for CAET (Computer-Aided Engineering Technology) training. Content lives on GitHub Pages while the LMS manages users, courses, topics, lessons, enrollments, and progress tracking.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prisma ORM** for database management
- **SQLite** for local development

## Database Schema

The system manages the following entities:

- **Users**: Admin and student accounts
- **Courses**: Training courses (e.g., "CAET Foundations")
- **Topics**: Course topics with ordering
- **Lessons**: Individual lessons with GitHub Pages URLs
- **Enrollments**: Student course enrollments
- **Progress**: Individual lesson progress tracking

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npx prisma migrate dev --name init
   ```
   This creates the SQLite database and applies the schema.

3. **Seed the database with sample data**:
   ```bash
   npx prisma db seed
   ```

   This creates:
   - 1 admin user (`admin@example.com`)
   - 1 sample student user (`student@example.com`)
   - 1 course ("CAET Foundations")
   - 8 topics covering CAET curriculum
   - 8 sample lessons (1 per topic) with placeholder GitHub URLs
   - 1 active enrollment for the student
   - Progress records for all lessons

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ace-lms/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── .env                   # Environment variables (DATABASE_URL)
├── package.json           # Project dependencies
└── tsconfig.json          # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Prisma Commands

- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma db seed` - Run the seed script
- `npx prisma generate` - Generate Prisma Client

## Sample Data

The seed script creates:

### Users
- **Admin**: admin@example.com
- **Student**: student@example.com

### Course: CAET Foundations
8 Topics:
1. Introduction to CAET
2. Engineering Fundamentals
3. CAD Systems
4. Simulation and Analysis
5. Data Management
6. Automation and Scripting
7. Project Management
8. Industry Applications

Each topic has 1 sample lesson with a placeholder GitHub Pages URL.

## Next Steps

1. **Build Authentication**: Implement user login/registration
2. **Create Student Dashboard**: Display enrolled courses and progress
3. **Build Course Pages**: Show topics and lessons
4. **Implement Progress Tracking**: Update lesson status as students complete them
5. **Add Admin Panel**: Manage courses, topics, and lessons
6. **Connect to Real GitHub Pages**: Update lesson URLs to point to actual content

## Development Tips

- Use Prisma Studio (`npx prisma studio`) to visually inspect and edit your database
- The GitHub URLs in lessons are placeholders - update them to your actual GitHub Pages URLs
- Extend the schema as needed for additional features (quizzes, assignments, etc.)

## License

ISC
