import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { lessonRepository, topicRepository, progressRepository } from '@/lib/repositories';

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const lessonId = params.lessonId;

    const lesson = lessonRepository.findById(lessonId);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const topic = topicRepository.findById(lesson.topicId);
    const progress = progressRepository.findByUserAndLesson(userId, lessonId);

    return NextResponse.json({
      lesson,
      topic,
      progress,
    });
  } catch (error) {
    console.error('Lesson fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
