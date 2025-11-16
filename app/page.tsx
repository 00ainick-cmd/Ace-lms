import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-slate-100">
        <div className="container-max">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold text-slate-900 mb-6">
              Welcome to AceLMS
            </h1>
            <p className="text-xl text-slate-700 mb-8">
              A modern learning management system designed to help you master new skills and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard"
                className="btn btn-primary py-3 px-8 text-lg font-semibold"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/courses"
                className="btn btn-outline py-3 px-8 text-lg font-semibold"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Why choose AceLMS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:shadow-lg transition-shadow">
              <div className="card-section">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Expert Instructors
                </h3>
                <p className="text-slate-600">
                  Learn from industry professionals and experienced educators
                </p>
              </div>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="card-section">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Self-Paced Learning
                </h3>
                <p className="text-slate-600">
                  Study at your own pace, on your own schedule
                </p>
              </div>
            </div>
            <div className="card hover:shadow-lg transition-shadow">
              <div className="card-section">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  Certifications
                </h3>
                <p className="text-slate-600">
                  Earn recognized certificates upon course completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to start learning?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Logged in as <span className="font-semibold">{user.name}</span>
          </p>
          <Link
            href="/dashboard"
            className="inline-block btn bg-white text-primary-600 hover:bg-slate-100 py-3 px-8 text-lg font-semibold shadow-lg"
          >
            Continue to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
