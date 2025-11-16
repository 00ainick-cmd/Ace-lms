export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to AceLMS</h1>
        <p className="text-lg text-gray-600 mb-8">
          A modern learning management system
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/admin"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Admin Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
