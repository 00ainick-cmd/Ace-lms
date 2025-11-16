# AceLMS - Learning Management System

A modern, polished learning management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Demo Authentication System** - Simple role-based login for Student and Admin users
- **Responsive Navigation** - Dynamic nav bar that displays different options based on user role
- **Dashboard** - Personalized dashboard with stats and quick actions
- **Course Catalog** - Browse and manage courses with detailed information
- **Admin Panel** - Comprehensive admin dashboard for managing users and content
- **Route Guards** - Protected routes that redirect unauthorized users
- **Modern UI** - Clean, professional design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/
│   ├── login/
│   │   └── route.ts           # Login API endpoint
│   └── logout/
│       └── route.ts           # Logout API endpoint
├── admin/
│   └── page.tsx               # Admin dashboard (protected)
├── courses/
│   └── page.tsx               # Course catalog
├── dashboard/
│   └── page.tsx               # User dashboard
├── login/
│   └── page.tsx               # Login page
├── layout.tsx                 # Root layout with navigation
├── page.tsx                   # Home page
└── globals.css                # Global styles

components/
├── Navigation.tsx             # Main navigation component

lib/
├── auth.ts                    # Authentication utilities
├── seed-data.ts               # Seed data for demo users
```

## Authentication

The app uses a simple cookie-based authentication system for demo purposes:

- **Login Page**: `/login` - Select between Student or Admin roles
- **Default User**: Student role if no role is set
- **Logout**: Clears the role cookie and redirects to login

### Demo Users

**Student Account:**
- ID: student-001
- Name: Alex Johnson
- Email: alex.johnson@example.com

**Admin Account:**
- ID: admin-001
- Name: Jane Doe
- Email: jane.doe@example.com

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page | Public |
| `/login` | Login page | Public |
| `/dashboard` | User dashboard | Authenticated |
| `/courses` | Course catalog | Authenticated |
| `/admin` | Admin dashboard | Admin only |

## Styling

The app uses Tailwind CSS with custom configuration:

- **Color Palette**: Primary (sky blue), Slate (neutral), with semantic colors
- **Components**: Reusable button, card, and input classes
- **Responsive**: Mobile-first design with proper breakpoints
- **Typography**: Consistent font sizes and weights

## Environment Variables

Currently, no environment variables are required for development.

## Notes

⚠️ **This is a demo/development authentication system**

This auth implementation is for development and demo purposes only. For production use, implement proper authentication with:
- Secure password hashing
- JWT or session-based auth
- Database integration
- HTTPS only
- CSRF protection
- Rate limiting

## License

MIT
