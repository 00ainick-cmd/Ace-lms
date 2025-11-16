import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get course with all lessons
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        topics: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get all lesson IDs in this course
    const lessonIds = course.topics.flatMap((topic) =>
      topic.lessons.map((lesson) => lesson.id)
    );

    // Get progress for all lessons in this course
    const progressRecords = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        lessonId: { in: lessonIds },
      },
    });

    // Calculate statistics
    const totalLessons = lessonIds.length;
    const completedLessons = progressRecords.filter(
      (p) => p.status === 'completed'
    ).length;
    const inProgressLessons = progressRecords.filter(
      (p) => p.status === 'in_progress'
    ).length;

    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return NextResponse.json({
      courseId: params.courseId,
      totalLessons,
      completedLessons,
      inProgressLessons,
      progressPercentage,
      lessonProgress: progressRecords.map((p) => ({
        lessonId: p.lessonId,
        status: p.status,
        visitedAt: p.visitedAt,
        completedAt: p.completedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching course progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
