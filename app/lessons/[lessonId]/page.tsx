'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Lesson {
  id: string;
  title: string;
  githubUrl: string;
  topicId: string;
  order: number;
}

interface Topic {
  id: string;
  title: string;
  courseId: string;
}

interface Progress {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchLessonData();
    }
  }, [status, params.lessonId]);

  const fetchLessonData = async () => {
    try {
      const response = await fetch(`/api/lessons/${params.lessonId}`);
      const data = await response.json();

      if (data.lesson) {
        setLesson(data.lesson);
        setTopic(data.topic);
        setProgress(data.progress);

        // Mark as in progress if not started
        if (!data.progress || data.progress.status === 'NOT_STARTED') {
          await updateProgress('IN_PROGRESS');
        }
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (status: 'IN_PROGRESS' | 'COMPLETED') => {
    if (!lesson) return;

    setUpdating(true);
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          status,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProgress(data.progress);

        if (status === 'COMPLETED' && topic) {
          // Redirect back to course page after a short delay
          setTimeout(() => {
            router.push(`/courses/${topic.courseId}`);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ace-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !topic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Lesson not found</p>
          <button onClick={() => router.push('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = progress?.status === 'COMPLETED';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <button
                onClick={() => router.push(`/courses/${topic.courseId}`)}
                className="text-ace-blue hover:underline mb-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to {topic.title}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            </div>

            <div className="flex items-center gap-4">
              {isCompleted ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Completed
                </div>
              ) : (
                <button
                  onClick={() => updateProgress('COMPLETED')}
                  disabled={updating}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Lesson Content - GitHub Pages Iframe */}
      <div className="flex-1 bg-white">
        <iframe
          src={lesson.githubUrl}
          className="w-full h-full border-0"
          title={lesson.title}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 text-sm text-gray-600">
          <p>Ace LMS • CAET Training</p>
        </div>
      </footer>
    </div>
  );
}
