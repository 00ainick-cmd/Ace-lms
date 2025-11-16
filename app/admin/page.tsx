import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getCurrentUser();

  // Route guard: redirect if not admin
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <main className="section-padding bg-slate-50 min-h-screen">
      <div className="container-max">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage courses, users, and platform settings
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card">
            <div className="card-section">
              <div className="text-sm text-slate-600 mb-2">Total Students</div>
              <div className="text-3xl font-bold text-primary-600">2,450</div>
              <p className="text-xs text-slate-600 mt-2">↑ 12% this month</p>
            </div>
          </div>
          <div className="card">
            <div className="card-section">
              <div className="text-sm text-slate-600 mb-2">Active Courses</div>
              <div className="text-3xl font-bold text-primary-600">24</div>
              <p className="text-xs text-slate-600 mt-2">6 new this quarter</p>
            </div>
          </div>
          <div className="card">
            <div className="card-section">
              <div className="text-sm text-slate-600 mb-2">Instructors</div>
              <div className="text-3xl font-bold text-primary-600">18</div>
              <p className="text-xs text-slate-600 mt-2">2 pending approval</p>
            </div>
          </div>
          <div className="card">
            <div className="card-section">
              <div className="text-sm text-slate-600 mb-2">Completions</div>
              <div className="text-3xl font-bold text-primary-600">856</div>
              <p className="text-xs text-slate-600 mt-2">↑ 23% vs last month</p>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Management Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="#" className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="card-section">
                <div className="text-3xl mb-3">👥</div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                  Manage Users
                </h3>
                <p className="text-slate-600 mt-2">
                  View, edit, and manage user accounts and roles
                </p>
                <button className="mt-4 btn btn-primary text-sm">
                  Go to Users
                </button>
              </div>
            </Link>

            <Link href="#" className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="card-section">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                  Manage Courses
                </h3>
                <p className="text-slate-600 mt-2">
                  Create, edit, and manage course content
                </p>
                <button className="mt-4 btn btn-primary text-sm">
                  Go to Courses
                </button>
              </div>
            </Link>

            <Link href="#" className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="card-section">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                  Analytics
                </h3>
                <p className="text-slate-600 mt-2">
                  View detailed platform analytics and reports
                </p>
                <button className="mt-4 btn btn-primary text-sm">
                  View Analytics
                </button>
              </div>
            </Link>

            <Link href="#" className="card hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="card-section">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                  Settings
                </h3>
                <p className="text-slate-600 mt-2">
                  Configure platform settings and preferences
                </p>
                <button className="mt-4 btn btn-primary text-sm">
                  Go to Settings
                </button>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Admin Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Recent Platform Activity
          </h2>
          <div className="card">
            <div className="card-section">
              <ul className="space-y-4">
                <li className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-900">
                      New student enrolled: John Smith
                    </p>
                    <p className="text-sm text-slate-600">2 hours ago</p>
                  </div>
                  <span className="text-2xl">✅</span>
                </li>
                <li className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-900">
                      Course published: "AI for Beginners"
                    </p>
                    <p className="text-sm text-slate-600">5 hours ago</p>
                  </div>
                  <span className="text-2xl">🚀</span>
                </li>
                <li className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-900">
                      Instructor approved: Mary Johnson
                    </p>
                    <p className="text-sm text-slate-600">1 day ago</p>
                  </div>
                  <span className="text-2xl">👤</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      System backup completed
                    </p>
                    <p className="text-sm text-slate-600">2 days ago</p>
                  </div>
                  <span className="text-2xl">💾</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
