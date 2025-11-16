import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/auth'

/**
 * GET /api/admin/students/[userId]/courses/[courseId]/progress
 * Returns detailed progress for a student in a specific course
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; courseId: string } }
) {
  try {
    // Check if user is admin
    const adminCheck = await isAdmin()
    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      )
    }

    const { userId, courseId } = params

    // Fetch user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch course with topics and lessons
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        topics: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Fetch all progress records for this user and course
    const lessonIds = course.topics.flatMap((topic) =>
      topic.lessons.map((lesson) => lesson.id)
    )

    const progressRecords = await prisma.progress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
      },
    })

    // Create a map for quick lookup
    const progressMap = new Map(
      progressRecords.map((p) => [p.lessonId, p])
    )

    // Build the response with topics and lessons with progress
    const topicsWithProgress = course.topics.map((topic) => ({
      topicId: topic.id,
      topicTitle: topic.title,
      lessons: topic.lessons.map((lesson) => {
        const progress = progressMap.get(lesson.id)
        return {
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          status: progress?.status || 'not_started',
          completedAt: progress?.completedAt || null,
        }
      }),
    }))

    // Calculate metrics
    const totalLessons = lessonIds.length
    const completedLessons = progressRecords.filter(
      (p) => p.status === 'completed'
    ).length

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
      },
      metrics: {
        totalLessons,
        completedLessons,
        completionPercentage:
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0,
      },
      topics: topicsWithProgress,
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    )
  }
}
