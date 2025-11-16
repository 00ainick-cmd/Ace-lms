'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function LessonViewer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const [status, setStatus] = useState(lesson.progress.status);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    // Mark lesson as visited when the page loads
    const markAsVisited = async () => {
      try {
        await fetch('/api/progress/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessonId: lesson.id }),
        });
      } catch (error) {
        console.error('Error marking lesson as visited:', error);
      }
    };

    if (status === 'not_started') {
      markAsVisited();
      setStatus('in_progress');
    }
  }, [lesson.id, status]);

  const handleMarkAsComplete = async () => {
    if (isCompleting) return;

    setIsCompleting(true);
    try {
      const response = await fetch('/api/progress/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonId: lesson.id }),
      });

      if (response.ok) {
        setStatus('completed');
        // Refresh the page to update progress
        router.refresh();
      }
    } catch (error) {
      console.error('Error marking lesson as complete:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Link
              href="/courses"
              className="hover:text-blue-600"
            >
              Courses
            </Link>
            <span>/</span>
            <Link
              href={`/courses/${lesson.topic.course.id}`}
              className="hover:text-blue-600"
            >
              {lesson.topic.course.title}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{lesson.topic.title}</span>
          </div>
        </nav>

        {/* Lesson Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-gray-600">{lesson.description}</p>
              )}
            </div>
            <div className="ml-4">
              {status === 'completed' ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-md border border-green-200">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Completed</span>
                </div>
              ) : (
                <button
                  onClick={handleMarkAsComplete}
                  disabled={isCompleting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isCompleting ? 'Saving...' : 'Mark as Complete'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Lesson content from:{' '}
              <a
                href={lesson.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {lesson.githubUrl}
              </a>
            </p>
          </div>
          <div className="relative" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
            <iframe
              src={lesson.githubUrl}
              title={lesson.title}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Link
            href={`/courses/${lesson.topic.course.id}`}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Course
          </Link>
        </div>
      </div>
    </div>
  );
}
