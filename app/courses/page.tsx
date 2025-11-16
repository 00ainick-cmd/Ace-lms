import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  students: number;
  rating: number;
  duration: string;
  icon: string;
}

const COURSES: Course[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Master advanced patterns and best practices in React development',
    instructor: 'Sarah Chen',
    level: 'Advanced',
    students: 1250,
    rating: 4.8,
    duration: '8 weeks',
    icon: '⚛️',
  },
  {
    id: '2',
    title: 'Web Development Fundamentals',
    description: 'Learn HTML, CSS, and JavaScript from scratch',
    instructor: 'Mike Johnson',
    level: 'Beginner',
    students: 3400,
    rating: 4.7,
    duration: '6 weeks',
    icon: '🌐',
  },
  {
    id: '3',
    title: 'Node.js & Express Mastery',
    description: 'Build scalable backend applications with Node.js',
    instructor: 'Emma Rodriguez',
    level: 'Intermediate',
    students: 890,
    rating: 4.9,
    duration: '10 weeks',
    icon: '🚀',
  },
  {
    id: '4',
    title: 'Database Design & SQL',
    description: 'Design and optimize relational databases',
    instructor: 'David Kim',
    level: 'Intermediate',
    students: 650,
    rating: 4.6,
    duration: '7 weeks',
    icon: '💾',
  },
  {
    id: '5',
    title: 'TypeScript for Professionals',
    description: 'Write type-safe JavaScript at scale',
    instructor: 'Lisa Wang',
    level: 'Intermediate',
    students: 1100,
    rating: 4.8,
    duration: '6 weeks',
    icon: '📘',
  },
  {
    id: '6',
    title: 'Cloud Architecture on AWS',
    description: 'Design and deploy applications on AWS',
    instructor: 'James Mitchell',
    level: 'Advanced',
    students: 560,
    rating: 4.7,
    duration: '12 weeks',
    icon: '☁️',
  },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

export default async function CoursesPage() {
  const user = await getCurrentUser();

  return (
    <main className="section-padding bg-slate-50 min-h-screen">
      <div className="container-max">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Explore Courses
          </h1>
          <p className="text-lg text-slate-600">
            {user.role === 'admin'
              ? 'Manage all courses on the platform'
              : 'Discover and enroll in courses to advance your skills'}
          </p>
        </div>

        {/* Search & Filter (simplified) */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="search"
            placeholder="Search courses..."
            className="input flex-1"
          />
          <select className="input sm:w-40">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSES.map((course) => (
            <div key={course.id} className="card hover:shadow-lg transition-shadow">
              {/* Course Header with Icon */}
              <div className="bg-gradient-to-br from-primary-50 to-slate-100 card-section flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {course.title}
                  </h3>
                </div>
                <span className="text-3xl">{course.icon}</span>
              </div>

              {/* Course Content */}
              <div className="card-section space-y-4">
                <p className="text-slate-600">{course.description}</p>

                {/* Instructor */}
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-900">Instructor:</span> {course.instructor}
                  </p>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Level</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(
                        course.level
                      )}`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <div>
                    <p className="text-slate-600">Duration</p>
                    <p className="font-medium text-slate-900">{course.duration}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Students</span>
                    <span className="font-medium text-slate-900">
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Rating</span>
                    <span className="font-medium text-slate-900">
                      ⭐ {course.rating}/5
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full btn btn-primary mt-6">
                  {user.role === 'admin' ? 'Manage Course' : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
