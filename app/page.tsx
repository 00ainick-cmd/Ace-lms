import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  topics: {
    id: string;
    lessons: { id: string }[];
  }[];
}

async function getUserData() {
  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/me`, {
    cache: 'no-store',
  });
  if (!response.ok) return null;
  return response.json();
}

async function getCourses() {
  const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses`, {
    cache: 'no-store',
  });
  if (!response.ok) return [];
  return response.json();
}

async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${courseId}/progress`,
    { cache: 'no-store' }
  );
  if (!response.ok) {
    return {
      courseId,
      totalLessons: 0,
      completedLessons: 0,
      progressPercentage: 0,
    };
  }
  return response.json();
}

function CourseCard({ course, progress }: { course: Course; progress: CourseProgress }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden border border-gray-200"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description || 'No description available'}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span className="font-medium">{progress.progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {progress.completedLessons} of {progress.totalLessons} lessons completed
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <span className="text-sm text-blue-600 font-medium hover:text-blue-700">
          View Course →
        </span>
      </div>
    </Link>
  );
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const courses: Course[] = await getCourses();

  // Fetch progress for all courses
  const progressData = await Promise.all(
    courses.map((course) => getCourseProgress(course.id))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No Courses Available
            </h2>
            <p className="text-gray-600">
              There are currently no courses available. Check back later!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              <p className="text-sm text-gray-600 mt-1">
                Continue your learning journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={progressData[index]}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
