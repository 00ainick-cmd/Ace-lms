import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { progressRepository } from '@/lib/repositories';
import type { ProgressStatus } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, status } = await request.json();
    const userId = (session.user as any).id;

    if (!lessonId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const progress = progressRepository.updateStatus(userId, lessonId, status as ProgressStatus);

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
