import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { getCurrentUser } from '@/lib/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'AceLMS',
  description: 'A modern learning management system',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation userRole={user.role} userName={user.name} />
        {children}
      </body>
    </html>
  );
}
