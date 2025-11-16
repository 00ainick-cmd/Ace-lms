import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-600 text-xl font-bold mb-2">Access Denied</div>
          <p className="text-gray-600">
            You do not have permission to access the admin dashboard. Only users
            with admin role can access this page.
          </p>
          <a
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return <AdminDashboardClient />
}
