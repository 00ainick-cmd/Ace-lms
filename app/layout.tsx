import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AceLMS - CAET Training Platform",
  description: "A lightweight Learning Management System for CAET training",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
