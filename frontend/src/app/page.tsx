"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="max-w-xl text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">AI Quiz App</h1>
          <p className="text-lg text-slate-500">Generate and take AI-powered quizzes on any topic instantly.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 px-12 py-6 text-base font-semibold" onClick={() => router.push("/login")}>
            Login
          </Button>
          <Button variant="outline" size="lg" className="border-slate-200 text-slate-600 hover:bg-slate-50 px-12 py-6 text-base font-semibold" onClick={() => router.push("/register")}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
