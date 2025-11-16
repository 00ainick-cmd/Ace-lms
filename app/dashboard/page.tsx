import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { courseRepository, enrollmentRepository, progressRepository } from '@/lib/repositories';
import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const userName = session?.user?.name || 'Student';

  // Get user's enrollments
  const enrollments = enrollmentRepository.findByUserId(userId);

  // Get course details and progress
  const coursesWithProgress = enrollments.map((enrollment) => {
    const course = courseRepository.findById(enrollment.courseId);
    const progress = progressRepository.getProgressSummary(userId, enrollment.courseId);

    return {
      ...course,
      enrollment,
      progress,
    };
  });

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-gray-600 mt-2">Continue your CAET training journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-ace-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{coursesWithProgress.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {coursesWithProgress.reduce((sum, c) => sum + (c.progress?.completedLessons || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-8 h-8 text-ace-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {coursesWithProgress.reduce((sum, c) => sum + (c.progress?.inProgressLessons || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>

          {coursesWithProgress.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">You are not enrolled in any courses yet.</p>
              <Link href="/courses" className="btn-primary inline-block">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {coursesWithProgress.map((course: any) => (
                <div key={course.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span>{course.progress?.totalLessons || 0} lessons</span>
                        <span>•</span>
                        <span className="text-green-600 font-semibold">
                          {course.progress?.completedLessons || 0} completed
                        </span>
                        {(course.progress?.inProgressLessons || 0) > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-orange-600 font-semibold">
                              {course.progress.inProgressLessons} in progress
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="md:w-64 space-y-4">
                      <ProgressBar
                        percentage={course.progress?.percentage || 0}
                        label="Overall Progress"
                      />
                      <Link
                        href={`/courses/${course.id}`}
                        className="btn-primary block text-center"
                      >
                        Continue Learning
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
