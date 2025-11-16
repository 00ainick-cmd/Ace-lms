# AceLMS - Learning Management System

A modern learning management system built with Next.js 14, Prisma, and Tailwind CSS.

## Features

### Admin Dashboard

The admin dashboard allows administrators to:
- View all students in the system
- Select a student to view their enrolled courses
- View detailed progress for each course including:
  - Topics and lessons structure
  - Lesson completion status
  - Completion dates
  - Progress metrics (completed lessons, total lessons, completion percentage)

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM
- **SQLite** - Database (for development)
- **Tailwind CSS** - Utility-first CSS framework

## Database Schema

### Models

- **User** - Stores user information (students and admins)
- **Course** - Course details
- **Topic** - Topics within a course
- **Lesson** - Lessons within a topic
- **Enrollment** - Student course enrollments
- **Progress** - Student lesson progress tracking

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. (Optional) Seed the database with sample data:
```bash
npx prisma db seed
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ace-lms/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── page.tsx             # Server component (auth check)
│   │   └── AdminDashboardClient.tsx  # Client component (UI)
│   ├── api/
│   │   └── admin/
│   │       └── students/        # Admin API routes
│   │           ├── route.ts     # GET all students
│   │           └── [userId]/
│   │               └── courses/
│   │                   ├── route.ts              # GET student courses
│   │                   └── [courseId]/
│   │                       └── progress/
│   │                           └── route.ts      # GET progress data
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── lib/
│   ├── db.ts                    # Prisma client
│   └── auth.ts                  # Authentication utilities
├── prisma/
│   └── schema.prisma            # Database schema
└── package.json
```

## API Routes

### Admin Routes

All admin routes require admin authentication.

#### GET `/api/admin/students`
Returns all users with `role = "student"`.

**Response:**
```json
[
  {
    "id": "string",
    "email": "string",
    "name": "string | null",
    "createdAt": "string"
  }
]
```

#### GET `/api/admin/students/[userId]/courses`
Returns all courses a student is enrolled in.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string | null",
    "enrolledAt": "string"
  }
]
```

#### GET `/api/admin/students/[userId]/courses/[courseId]/progress`
Returns detailed progress for a student in a specific course.

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string | null"
  },
  "course": {
    "id": "string",
    "title": "string",
    "description": "string | null"
  },
  "metrics": {
    "totalLessons": 0,
    "completedLessons": 0,
    "completionPercentage": 0
  },
  "topics": [
    {
      "topicId": "string",
      "topicTitle": "string",
      "lessons": [
        {
          "lessonId": "string",
          "lessonTitle": "string",
          "status": "not_started | in_progress | completed",
          "completedAt": "string | null"
        }
      ]
    }
  ]
}
```

## Authentication

The current implementation uses a mock authentication system in `lib/auth.ts`. The `getCurrentUser()` function returns a mock admin user for demonstration purposes.

### For Production

In a production environment, you should:
1. Implement proper session management (NextAuth.js, Clerk, etc.)
2. Store session tokens in secure HTTP-only cookies
3. Validate sessions on each request
4. Implement proper login/logout functionality

## Admin Dashboard Usage

1. Navigate to `/admin`
2. If not authorized, you'll see an access denied message
3. If authorized (as admin):
   - View the list of all students on the left
   - Click on a student to see their enrolled courses
   - Click on a course to see detailed progress
   - View metrics at the top (completed lessons, total, percentage)
   - Browse the progress table showing topics, lessons, status, and completion dates

## Styling

The application uses Tailwind CSS for styling with:
- Clean, modern design
- Responsive layout (mobile-friendly)
- Color-coded status badges:
  - Green for "Completed"
  - Yellow for "In Progress"
  - Gray for "Not Started"
- Interactive hover states
- Proper spacing and typography

## Development

### Running Prisma Studio

To view and edit database data:
```bash
npx prisma studio
```

### Database Migrations

When you modify the schema:
```bash
npx prisma generate
npx prisma db push
```

### Type Checking

```bash
npx tsc --noEmit
```

## License

MIT
