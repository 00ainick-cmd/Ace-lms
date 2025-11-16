'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface NavigationProps {
  userRole: 'student' | 'admin';
  userName: string;
}

export function Navigation({ userRole, userName }: NavigationProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container-max flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold">
            A
          </div>
          <span className="text-xl font-bold">AceLMS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/dashboard"
            className="text-slate-200 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/courses"
            className="text-slate-200 hover:text-white transition-colors"
          >
            Courses
          </Link>

          {/* Admin-only link */}
          {userRole === 'admin' && (
            <Link
              href="/admin"
              className="text-slate-200 hover:text-white transition-colors"
            >
              Admin
            </Link>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4 pl-4 border-l border-slate-700">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-slate-400 capitalize">{userRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="container-max flex flex-col space-y-3 py-4">
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/courses"
              className="px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </Link>

            {/* Admin-only link */}
            {userRole === 'admin' && (
              <Link
                href="/admin"
                className="px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}

            <div className="border-t border-slate-700 pt-3 mt-3">
              <p className="text-sm font-medium mb-2">{userName}</p>
              <p className="text-xs text-slate-400 capitalize mb-3">{userRole}</p>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
