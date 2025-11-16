import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  githubUrl: string;
  order: number;
}

interface Topic {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  topics: Topic[];
}

interface LessonProgress {
  lessonId: string;
  status: string;
}

interface CourseProgress {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lessonProgress: LessonProgress[];
}

async function getCourse(courseId: string): Promise<Course | null> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${courseId}`,
    { cache: 'no-store' }
  );
  if (!response.ok) return null;
  return response.json();
}

async function getCourseProgress(courseId: string): Promise<CourseProgress> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${courseId}/progress`,
    { cache: 'no-store' }
  );
  if (!response.ok) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      progressPercentage: 0,
      lessonProgress: [],
    };
  }
  return response.json();
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    not_started: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const labels = {
    completed: 'Completed',
    in_progress: 'In Progress',
    not_started: 'Not Started',
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status as keyof typeof styles] || styles.not_started
      }`}
    >
      {labels[status as keyof typeof labels] || 'Not Started'}
    </span>
  );
}

function LessonCard({
  lesson,
  status,
}: {
  lesson: Lesson;
  status: string;
}) {
  const buttonText = status === 'completed' ? 'Review' : status === 'in_progress' ? 'Continue' : 'Start';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-base font-semibold text-gray-900">{lesson.title}</h4>
        <StatusBadge status={status} />
      </div>
      {lesson.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {lesson.description}
        </p>
      )}
      <Link
        href={`/lessons/${lesson.id}`}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
      >
        {buttonText}
        <svg
          className="ml-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
}

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const course = await getCourse(params.courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Link
            href="/courses"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const progress = await getCourseProgress(params.courseId);

  // Create a map of lesson progress
  const progressMap = new Map(
    progress.lessonProgress.map((p) => [p.lessonId, p.status])
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <Link
            href="/courses"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            ← Back to Courses
          </Link>
        </nav>

        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{course.title}</h1>
          {course.description && (
            <p className="text-gray-600 mb-4">{course.description}</p>
          )}

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-medium">Course Progress</span>
              <span className="font-medium">{progress.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                {progress.completedLessons} of {progress.totalLessons} lessons completed
              </span>
            </div>
          </div>
        </div>

        {/* Topics and Lessons */}
        <div className="space-y-8">
          {course.topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{topic.title}</h2>
                {topic.description && (
                  <p className="text-gray-600 mt-1">{topic.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topic.lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    status={progressMap.get(lesson.id) || 'not_started'}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
