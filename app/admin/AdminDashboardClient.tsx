'use client'

import { useEffect, useState } from 'react'

interface Student {
  id: string
  email: string
  name: string | null
  createdAt: string
}

interface Course {
  id: string
  title: string
  description: string | null
  enrolledAt: string
}

interface LessonProgress {
  lessonId: string
  lessonTitle: string
  status: string
  completedAt: string | null
}

interface TopicProgress {
  topicId: string
  topicTitle: string
  lessons: LessonProgress[]
}

interface ProgressData {
  user: {
    id: string
    email: string
    name: string | null
  }
  course: {
    id: string
    title: string
    description: string | null
  }
  metrics: {
    totalLessons: number
    completedLessons: number
    completionPercentage: number
  }
  topics: TopicProgress[]
}

export default function AdminDashboardClient() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all students on mount
  useEffect(() => {
    fetchStudents()
  }, [])

  // Fetch all students
  async function fetchStudents() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/students')
      if (!response.ok) throw new Error('Failed to fetch students')
      const data = await response.json()
      setStudents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  // Fetch courses for selected student
  async function fetchStudentCourses(studentId: string) {
    try {
      setLoading(true)
      setCourses([])
      setSelectedCourse(null)
      setProgressData(null)

      const response = await fetch(`/api/admin/students/${studentId}/courses`)
      if (!response.ok) throw new Error('Failed to fetch courses')
      const data = await response.json()
      setCourses(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courses')
    } finally {
      setLoading(false)
    }
  }

  // Fetch progress for selected student and course
  async function fetchProgress(studentId: string, courseId: string) {
    try {
      setLoading(true)
      setProgressData(null)

      const response = await fetch(
        `/api/admin/students/${studentId}/courses/${courseId}/progress`
      )
      if (!response.ok) throw new Error('Failed to fetch progress')
      const data = await response.json()
      setProgressData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress')
    } finally {
      setLoading(false)
    }
  }

  // Handle student selection
  function handleStudentSelect(student: Student) {
    setSelectedStudent(student)
    setSelectedCourse(null)
    setProgressData(null)
    setError(null)
    fetchStudentCourses(student.id)
  }

  // Handle course selection
  function handleCourseSelect(course: Course) {
    setSelectedCourse(course)
    setError(null)
    if (selectedStudent) {
      fetchProgress(selectedStudent.id, course.id)
    }
  }

  // Get status badge color
  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Format status text
  function formatStatus(status: string) {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in_progress':
        return 'In Progress'
      default:
        return 'Not Started'
    }
  }

  // Format date
  function formatDate(date: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">View and manage student progress</p>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Students List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Students</h2>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {loading && students.length === 0 ? (
                  <div className="px-6 py-4 text-gray-500">Loading students...</div>
                ) : students.length === 0 ? (
                  <div className="px-6 py-4 text-gray-500">No students found</div>
                ) : (
                  students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleStudentSelect(student)}
                      className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                        selectedStudent?.id === student.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {student.name || 'Unnamed Student'}
                      </div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!selectedStudent ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Select a student to view their progress
              </div>
            ) : (
              <>
                {/* Student Info Card */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedStudent.name || 'Unnamed Student'}
                    </h2>
                    <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                  </div>

                  {/* Courses List */}
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Enrolled Courses
                    </h3>
                    {loading && courses.length === 0 ? (
                      <p className="text-gray-500">Loading courses...</p>
                    ) : courses.length === 0 ? (
                      <p className="text-gray-500">No courses found for this student</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {courses.map((course) => (
                          <button
                            key={course.id}
                            onClick={() => handleCourseSelect(course)}
                            className={`text-left p-4 border rounded-lg hover:border-blue-500 transition-colors ${
                              selectedCourse?.id === course.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="font-medium text-gray-900">
                              {course.title}
                            </div>
                            {course.description && (
                              <div className="text-sm text-gray-500 mt-1">
                                {course.description}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Data */}
                {loading && !progressData ? (
                  <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    Loading progress data...
                  </div>
                ) : progressData ? (
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Progress: {progressData.course.title}
                      </h2>
                    </div>

                    {/* Metrics */}
                    <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {progressData.metrics.completedLessons}
                          </div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-700">
                            {progressData.metrics.totalLessons}
                          </div>
                          <div className="text-sm text-gray-600">Total Lessons</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {progressData.metrics.completionPercentage}%
                          </div>
                          <div className="text-sm text-gray-600">Complete</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Table */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Topic
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lesson
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Completed At
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {progressData.topics.map((topic) =>
                            topic.lessons.map((lesson, lessonIndex) => (
                              <tr key={lesson.lessonId}>
                                {lessonIndex === 0 && (
                                  <td
                                    rowSpan={topic.lessons.length}
                                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 bg-gray-50"
                                  >
                                    {topic.topicTitle}
                                  </td>
                                )}
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {lesson.lessonTitle}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                      lesson.status
                                    )}`}
                                  >
                                    {formatStatus(lesson.status)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(lesson.completedAt)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
