'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (role: 'student' | 'admin') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">A</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to AceLMS</h1>
          <p className="text-slate-600">Select your role to get started</p>
        </div>

        {/* Login Card */}
        <div className="card shadow-lg">
          <div className="card-section">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Student Login */}
              <button
                onClick={() => handleLogin('student')}
                disabled={isLoading}
                className="w-full btn btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  '📚 Login as Student'
                )}
              </button>

              {/* Admin Login */}
              <button
                onClick={() => handleLogin('admin')}
                disabled={isLoading}
                className="w-full btn btn-outline py-4 text-lg font-semibold border-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  '🔐 Login as Admin'
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
              <p>Demo/Dev Only</p>
              <p className="text-xs mt-1">
                This is a demo authentication system for development purposes
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-3">Demo Accounts</h3>
          <div className="space-y-3 text-sm text-slate-600">
            <div>
              <p className="font-medium text-slate-900">Student Account</p>
              <p>Alex Johnson (alex.johnson@example.com)</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <p className="font-medium text-slate-900">Admin Account</p>
              <p>Jane Doe (jane.doe@example.com)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
