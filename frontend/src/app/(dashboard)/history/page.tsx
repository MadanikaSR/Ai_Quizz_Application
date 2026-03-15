"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("history/");
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (isLoading) return <div className="text-center py-20 font-bold uppercase tracking-widest text-gray-400">Loading History...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quiz History</h1>
        <Button onClick={() => router.push("/create-quiz")} className="bg-slate-900 text-white hover:bg-slate-800 transition-colors">
          New Quiz
        </Button>
      </div>

      {history.length === 0 ? (
        <Card className="p-20 text-center border-slate-200 border-dashed bg-white">
          <p className="text-slate-500 mb-4">You haven't taken any quizzes yet.</p>
          <Button variant="outline" onClick={() => router.push("/create-quiz")} className="border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Start Your First Quiz
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((attempt) => (
            <Card key={attempt.id} className="p-6 flex items-center justify-between hover:border-slate-300 transition-colors border-slate-200">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-slate-900">{attempt.quiz_title}</h3>
                <div className="flex gap-4 text-sm text-slate-500">
                  <span>Score: {attempt.score / 10} / {attempt.total_questions}</span>
                  <span>{new Date(attempt.completed_at).toLocaleDateString()}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.push(`/quiz/${attempt.quiz_uuid}`)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Retake
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
