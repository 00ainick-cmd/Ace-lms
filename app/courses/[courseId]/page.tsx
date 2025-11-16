import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  courseRepository,
  topicRepository,
  lessonRepository,
  progressRepository,
  enrollmentRepository,
} from '@/lib/repositories';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProgressBar from '@/components/ProgressBar';

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const userId = (session.user as any).id;
  const courseId = params.courseId;

  // Ensure user is enrolled
  enrollmentRepository.enrollIfNotExists(userId, courseId);

  // Get course with topics and lessons
  const course = courseRepository.findWithTopics(courseId);
  if (!course) {
    redirect('/dashboard');
  }

  // Get progress summary
  const progressSummary = progressRepository.getProgressSummary(userId, courseId);

  // Get progress for all lessons
  const allProgress = progressRepository.findByUserId(userId);
  const progressMap = new Map(allProgress.map((p) => [p.lessonId, p]));

  // Add progress to topics
  const topicsWithProgress = course.topics.map((topic) => {
    const lessonsWithProgress = topic.lessons.map((lesson) => ({
      ...lesson,
      progress: progressMap.get(lesson.id),
    }));

    const completedCount = lessonsWithProgress.filter(
      (l) => l.progress?.status === 'COMPLETED'
    ).length;

    return {
      ...topic,
      lessons: lessonsWithProgress,
      completedCount,
      totalCount: lessonsWithProgress.length,
    };
  });

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-ace-blue hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>

        {/* Progress Overview */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Lessons</p>
              <p className="text-3xl font-bold text-gray-900">{progressSummary.totalLessons}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{progressSummary.completedLessons}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-orange-600">{progressSummary.inProgressLessons}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Overall</p>
              <p className="text-3xl font-bold text-ace-blue">{progressSummary.percentage}%</p>
            </div>
          </div>
          <div className="mt-6">
            <ProgressBar percentage={progressSummary.percentage} showPercentage={false} />
          </div>
        </div>

        {/* Topics and Lessons */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>

          {topicsWithProgress.map((topic, topicIndex) => (
            <div key={topic.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ace-blue text-white font-bold text-sm">
                      {topicIndex + 1}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{topic.title}</h3>
                  </div>
                  {topic.description && <p className="text-gray-600 text-sm ml-11">{topic.description}</p>}
                </div>
                <div className="text-sm text-gray-600">
                  {topic.completedCount} / {topic.totalCount} completed
                </div>
              </div>

              <div className="ml-11 space-y-2">
                {topic.lessons.map((lesson, lessonIndex) => {
                  const status = lesson.progress?.status || 'NOT_STARTED';
                  const isCompleted = status === 'COMPLETED';
                  const isInProgress = status === 'IN_PROGRESS';

                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.id}`}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-ace-blue hover:bg-blue-50 transition-all duration-150 group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm text-gray-500 font-medium w-8">
                          {topicIndex + 1}.{lessonIndex + 1}
                        </span>
                        <span className="text-gray-900 group-hover:text-ace-blue font-medium">
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Completed
                          </span>
                        )}
                        {isInProgress && (
                          <span className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            In Progress
                          </span>
                        )}
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-ace-blue"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
