import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AceLMS</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Welcome to AceLMS
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A lightweight Learning Management System for CAET training.
            Track your progress, earn badges, and master new skills.
          </p>
          <div className="mt-8 space-x-4">
            <Link href="/register">
              <Button size="lg">Start Learning</Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Track Progress</CardTitle>
              <CardDescription>
                Monitor your learning journey with detailed progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                See completion percentages, time spent, and your learning streak
                all in one place.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earn Badges</CardTitle>
              <CardDescription>
                Get recognized for your achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Complete modules, pass assessments, and maintain streaks to earn
                badges and points.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Take Assessments</CardTitle>
              <CardDescription>
                Test your knowledge with quizzes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Each module includes assessments to verify your understanding
                and track mastery.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Section */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Set up your development environment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="font-medium">1. Install dependencies:</p>
              <code className="block bg-muted p-2 rounded text-sm">
                npm install
              </code>
            </div>
            <div className="space-y-2">
              <p className="font-medium">2. Set up environment variables:</p>
              <code className="block bg-muted p-2 rounded text-sm">
                cp .env.example .env
              </code>
            </div>
            <div className="space-y-2">
              <p className="font-medium">3. Run database migrations:</p>
              <code className="block bg-muted p-2 rounded text-sm">
                npx prisma migrate dev
              </code>
            </div>
            <div className="space-y-2">
              <p className="font-medium">4. Seed the database:</p>
              <code className="block bg-muted p-2 rounded text-sm">
                npx prisma db seed
              </code>
            </div>
            <div className="space-y-2">
              <p className="font-medium">5. Start the development server:</p>
              <code className="block bg-muted p-2 rounded text-sm">
                npm run dev
              </code>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 AceLMS - CAET Training Platform</p>
        </div>
      </footer>
    </div>
  );
}
