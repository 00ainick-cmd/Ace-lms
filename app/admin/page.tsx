import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  userRepository,
  courseRepository,
  progressRepository,
  topicRepository,
  lessonRepository,
} from '@/lib/repositories';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Get all students
  const students = userRepository.findStudents();

  // Get all courses
  const courses = courseRepository.findAll();

  // Build student progress data
  const studentProgressData = students.map((student) => {
    const courseProgress = courses.map((course) => {
      const summary = progressRepository.getProgressSummary(student.id, course.id);
      return {
        courseId: course.id,
        courseTitle: course.title,
        ...summary,
      };
    });

    return {
      student,
      courseProgress,
    };
  });

  // Build topic completion stats
  const topicStats = courses.flatMap((course) => {
    const topics = topicRepository.findByCourseId(course.id);
    return topics.map((topic) => {
      const lessons = lessonRepository.findByTopicId(topic.id);
      const totalLessons = lessons.length;

      // Count completions per student
      const studentCompletions = students.map((student) => {
        const completedCount = lessons.filter((lesson) => {
          const progress = progressRepository.findByUserAndLesson(student.id, lesson.id);
          return progress?.status === 'COMPLETED';
        }).length;

        return {
          studentId: student.id,
          studentName: student.name,
          completedCount,
        };
      });

      const totalCompletions = studentCompletions.reduce((sum, s) => sum + s.completedCount, 0);
      const maxPossible = totalLessons * students.length;
      const completionRate = maxPossible > 0 ? Math.round((totalCompletions / maxPossible) * 100) : 0;

      return {
        courseTitle: course.title,
        topicTitle: topic.title,
        totalLessons,
        studentCompletions,
        completionRate,
      };
    });
  });

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor student progress and course completion</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-8 h-8 text-ace-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-8 h-8 text-ace-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900">
                  {topicStats.length > 0
                    ? Math.round(
                        topicStats.reduce((sum, t) => sum + t.completionRate, 0) / topicStats.length
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Progress Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Progress</h2>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  {courses.map((course) => (
                    <th key={course.id} className="text-center py-3 px-4 font-semibold text-gray-700">
                      {course.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {studentProgressData.map(({ student, courseProgress }) => (
                  <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{student.name}</td>
                    <td className="py-3 px-4 text-gray-600">{student.email}</td>
                    {courseProgress.map((cp) => (
                      <td key={cp.courseId} className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="text-lg font-bold text-ace-blue">{cp.percentage}%</span>
                          <span className="text-xs text-gray-600">
                            {cp.completedLessons}/{cp.totalLessons}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Topic Completion Stats */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Topic Completion Statistics</h2>
          <div className="space-y-4">
            {topicStats.map((stat, index) => (
              <div key={index} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{stat.topicTitle}</h3>
                    <p className="text-sm text-gray-600">{stat.courseTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-ace-blue">{stat.completionRate}%</p>
                    <p className="text-xs text-gray-600">completion rate</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {stat.studentCompletions.map((sc) => {
                    const percentage = stat.totalLessons > 0
                      ? Math.round((sc.completedCount / stat.totalLessons) * 100)
                      : 0;

                    return (
                      <div key={sc.studentId} className="flex items-center gap-2 text-sm">
                        <div className="flex-1">
                          <p className="text-gray-700 font-medium truncate">{sc.studentName}</p>
                          <div className="progress-bar mt-1">
                            <div className="progress-fill" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">
                          {sc.completedCount}/{stat.totalLessons}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
