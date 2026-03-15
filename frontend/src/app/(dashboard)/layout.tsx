"use client";

import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 uppercase tracking-tight">
      <Navbar />
      <main className="max-w-4xl mx-auto p-4 py-8">
        {children}
      </main>
    </div>
  );
}
