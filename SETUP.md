# Ace LMS Setup Guide

This guide will help you set up and run the Ace LMS project locally.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Quick Start

Follow these steps to get the project running:

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages and automatically generate Prisma client.

### 2. Set Up Database

Initialize the database and run migrations:

```bash
npx prisma migrate dev --name init
```

### 3. Seed the Database

Populate the database with sample data:

```bash
npx prisma db seed
```

This will create:
- A test student account (email: student@test.com, password: password123)
- Two sample courses with topics and lessons

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Login

Use the following credentials to log in:
- **Email**: student@test.com
- **Password**: password123

## Project Structure

```
ace-lms/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth authentication
│   │   ├── courses/         # Course endpoints
│   │   ├── lessons/         # Lesson endpoints
│   │   ├── me/              # User profile endpoint
│   │   └── progress/        # Progress tracking endpoints
│   ├── courses/             # Course pages
│   │   ├── [courseId]/      # Dynamic course detail page
│   │   └── page.tsx         # Courses list page
│   ├── lessons/             # Lesson pages
│   │   └── [lessonId]/      # Dynamic lesson viewer page
│   ├── login/               # Login page
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx             # Dashboard (homepage)
│   └── globals.css          # Global styles
├── lib/                     # Utility functions
│   ├── auth.ts              # NextAuth configuration
│   └── prisma.ts            # Prisma client singleton
├── prisma/                  # Database
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeder
└── types/                   # TypeScript type definitions
    └── next-auth.d.ts       # NextAuth type extensions
```

## Features

### Student Dashboard
- View all enrolled courses
- Track progress with visual progress bars
- See completion percentages

### Course Catalog
- Browse all available courses
- View course details including topics and lessons

### Course Detail Page
- See course structure organized by topics
- View lesson status (Not Started, In Progress, Completed)
- Track overall course progress
- Navigate to individual lessons

### Lesson Viewer
- View lesson content via iframe (GitHub Pages integration)
- Automatic progress tracking when visiting a lesson
- Mark lessons as complete
- Breadcrumb navigation
- Direct links to lesson source

### API Endpoints

- `GET /api/me` - Get current user profile
- `GET /api/courses` - Get all courses
- `GET /api/courses/[courseId]` - Get specific course details
- `GET /api/courses/[courseId]/progress` - Get course progress for current user
- `GET /api/lessons/[lessonId]` - Get lesson details
- `POST /api/progress/visit` - Mark lesson as visited (in progress)
- `POST /api/progress/complete` - Mark lesson as completed

## Database Schema

### Models
- **User**: Student accounts with authentication
- **Course**: Course information
- **Topic**: Course sections/modules
- **Lesson**: Individual lessons with GitHub Pages URLs
- **Progress**: User progress tracking per lesson

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (database viewer)
npx prisma studio

# Reset database (careful - deletes all data!)
npx prisma migrate reset
```

## Troubleshooting

### Database Issues
If you encounter database issues, try resetting:
```bash
npx prisma migrate reset
npx prisma db seed
```

### Authentication Issues
Make sure your `.env` file has the correct `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.

### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
npm run dev -- -p 3001
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Session Management**: JWT tokens

## Next Steps

After setting up the project, you can:
1. Explore the dashboard and courses
2. Complete some lessons to see progress tracking in action
3. Add more courses, topics, and lessons via Prisma Studio
4. Customize the UI with Tailwind CSS
5. Extend the API with additional features

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
