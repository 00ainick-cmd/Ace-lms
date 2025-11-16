import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LessonViewer from './LessonViewer';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  githubUrl: string;
  topic: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  progress: {
    status: string;
  };
}

async function getLesson(lessonId: string): Promise<Lesson | null> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/lessons/${lessonId}`,
    { cache: 'no-store' }
  );
  if (!response.ok) return null;
  return response.json();
}

export default async function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const lesson = await getLesson(params.lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Lesson Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The lesson you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return <LessonViewer lesson={lesson} />;
}
