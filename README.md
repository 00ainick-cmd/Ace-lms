# Ace LMS - CAET Training Platform

A lightweight Learning Management System designed for Computer and Avionics Electronics Technology (CAET) training.

## Features

- **Student Dashboard**: View enrolled courses and track progress
- **Course Navigation**: Browse course topics and lessons organized by CAET curriculum
- **Lesson Viewer**: Embedded GitHub Pages content with progress tracking
- **Admin Dashboard**: Monitor student progress and course completion statistics
- **Progress Tracking**: Automatic tracking of lesson status (not started, in progress, completed)
- **Role-based Access**: Separate views for students and administrators

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via better-sqlite3)
- **Authentication**: NextAuth.js
- **UI Theme**: Aviation-inspired design with Ace blue/orange accents

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Ace-lms
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # .env file is already configured with defaults
   # Update NEXTAUTH_SECRET in production
   ```

4. Seed the database:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials

**Admin Access:**
- Email: admin@acelms.com
- Password: admin123

**Student Access:**
- Email: john@student.com
- Password: student123
- Email: jane@student.com
- Password: student123

## Project Structure

```
ace-lms/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth authentication
│   │   ├── lessons/      # Lesson data endpoints
│   │   └── progress/     # Progress tracking endpoints
│   ├── admin/            # Admin dashboard pages
│   ├── courses/          # Course view pages
│   ├── dashboard/        # Student dashboard
│   ├── lessons/          # Lesson viewer pages
│   └── login/            # Login page
├── components/           # Reusable React components
├── lib/
│   ├── db.ts            # Database initialization
│   ├── repositories.ts  # Data access layer
│   ├── types.ts         # TypeScript type definitions
│   ├── auth.ts          # NextAuth configuration
│   └── seed.ts          # Database seeding script
└── public/              # Static assets
```

## Course Structure

The platform includes the CAET Foundations course with 8 main topics:

1. Maintenance Regulations and Forms
2. Aircraft Handling and Safety
3. Fundamentals of DC
4. Fundamentals of AC and Semiconductors
5. Aircraft Electrical System
6. Aircraft Wiring
7. Digital Electronics
8. Communication, Navigation, Surveillance Systems

## Data Model

- **User**: Students and administrators with role-based access
- **Course**: Top-level course container
- **Topic**: Course sections organized by subject
- **Lesson**: Individual lesson content (GitHub Pages URLs)
- **Enrollment**: Student-course relationships
- **Progress**: Lesson completion tracking per student

## Features in Detail

### Student Experience
- View enrolled courses on dashboard
- Track overall progress with visual indicators
- Navigate course topics and lessons
- View lesson content in embedded GitHub Pages viewer
- Mark lessons as complete
- See completed, in-progress, and not-started statuses

### Admin Experience
- Monitor all student progress at a glance
- View completion statistics by topic
- Track individual student performance across courses
- See overall completion rates and trends

## Development

### Building for Production

```bash
npm run build
npm start
```

### Database Management

Reset and reseed the database:
```bash
rm ace-lms.db
npm run seed
```

## Configuration

### GitHub Pages Content

Lessons are configured to load content from GitHub Pages. Update lesson URLs in `lib/seed.ts` to point to your actual GitHub Pages content.

### Styling

The color scheme can be customized in `tailwind.config.ts`:
```typescript
colors: {
  ace: {
    navy: '#0a1e3d',
    blue: '#2563eb',
    orange: '#f97316',
    lightBlue: '#3b82f6',
  },
}
```

## Future Enhancements (Phase 2+)

- Quizzes and assessments
- CSV export of progress data
- Additional courses
- SSO integration
- Course analytics and reporting
- Mobile app

## License

MIT

## Support

For issues and questions, please contact your system administrator.
