export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Welcome to AceLMS</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A lightweight Learning Management System for CAET training
        </p>

        <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">Getting Started</h2>
          <p className="mb-4">Your LMS is ready! Next steps:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Run database migrations: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npx prisma migrate dev</code></li>
            <li>Seed the database: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">npx prisma db seed</code></li>
            <li>Build your course pages and student dashboard</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
