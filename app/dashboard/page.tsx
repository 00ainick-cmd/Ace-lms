import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <main className="section-padding bg-slate-50 min-h-screen">
      <div className="container-max">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-slate-600">
            {user.role === 'admin'
              ? "You're logged in as an Administrator. Manage the platform from the Admin dashboard."
              : "Continue your learning journey with us."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="card-section">
              <div className="text-4xl font-bold text-primary-600 mb-2">8</div>
              <p className="text-slate-600">Enrolled Courses</p>
            </div>
          </div>
          <div className="card">
            <div className="card-section">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {user.role === 'admin' ? '245' : '64'}
              </div>
              <p className="text-slate-600">
                {user.role === 'admin' ? 'Total Students' : 'Hours Learning'}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-section">
              <div className="text-4xl font-bold text-primary-600 mb-2">85%</div>
              <p className="text-slate-600">
                {user.role === 'admin' ? 'Platform Health' : 'Overall Progress'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/courses"
              className="card hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="card-section">
                <div className="text-3xl mb-3">📚</div>
                <h3 className="text-xl font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                  View Courses
                </h3>
                <p className="text-slate-600 mt-2">
                  Browse and enroll in available courses
                </p>
              </div>
            </Link>

            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="card-section">
                  <div className="text-3xl mb-3">🔧</div>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                    Admin Panel
                  </h3>
                  <p className="text-slate-600 mt-2">
                    Manage courses, users, and platform settings
                  </p>
                </div>
              </Link>
            )}

            {user.role === 'student' && (
              <Link
                href="/courses"
                className="card hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="card-section">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                    Continue Learning
                  </h3>
                  <p className="text-slate-600 mt-2">
                    Resume your in-progress courses
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Recent Activity
          </h2>
          <div className="card">
            <div className="card-section">
              <ul className="space-y-4">
                <li className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-900">
                      Started "Advanced React Patterns"
                    </p>
                    <p className="text-sm text-slate-600">2 days ago</p>
                  </div>
                  <span className="text-2xl">🚀</span>
                </li>
                <li className="flex items-center justify-between pb-4 border-b border-slate-200 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-slate-900">
                      Completed module "State Management"
                    </p>
                    <p className="text-sm text-slate-600">1 week ago</p>
                  </div>
                  <span className="text-2xl">✅</span>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      Joined "Web Development Fundamentals"
                    </p>
                    <p className="text-sm text-slate-600">2 weeks ago</p>
                  </div>
                  <span className="text-2xl">📖</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
