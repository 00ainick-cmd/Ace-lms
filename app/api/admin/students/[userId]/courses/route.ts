import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdmin } from '@/lib/auth'

/**
 * GET /api/admin/students/[userId]/courses
 * Returns all courses a student is enrolled in
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    const { userId } = params

    // Fetch enrollments with course details
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    })

    const courses = enrollments.map((enrollment) => ({
      ...enrollment.course,
      enrolledAt: enrollment.enrolledAt,
    }))

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching student courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student courses' },
      { status: 500 }
    )
  }
}
