"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { PlusCircle, History as HistoryIcon, User } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-12 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {user.username}
        </h1>
        <p className="text-slate-500">Pick up where you left off or start something new.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-slate-300 transition-colors group cursor-pointer border-slate-200" onClick={() => router.push("/create-quiz")}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Create Quiz</CardTitle>
            <CardDescription>Generate a new AI quiz on any topic</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 transition-colors">Create Now</Button>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-colors group cursor-pointer border-slate-200" onClick={() => router.push("/history")}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold">Quiz History</CardTitle>
            <CardDescription>Review your past scores and attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">View History</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
