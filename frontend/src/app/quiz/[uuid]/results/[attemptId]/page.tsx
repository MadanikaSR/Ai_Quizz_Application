"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/axios";

export default function ResultsPage() {
  const { uuid, attemptId } = useParams();
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get(`attempts/${attemptId}/`);
        // The backend returns { attempt: {...}, quiz: {...}, questions_with_answers: [...] }
        setResult(res.data);
      } catch (err) {
        console.error("Failed to fetch results", err);
      }
    };
    if (attemptId) fetchResults();
  }, [attemptId]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-slate-900 animate-spin rounded-full" />
        <p className="text-sm text-slate-500 font-medium">Reviewing quiz results...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <Card className="text-center p-12 shadow-sm border-slate-200 bg-white max-w-2xl mx-auto">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold text-slate-900">Quiz results</CardTitle>
          <CardDescription>Well done! Here's how you performed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-7xl font-bold text-slate-900">
            {result.attempt.score / 10} / {result.quiz.questions?.length || 0}
          </div>
          <p className="text-lg text-slate-500">
            Accuracy: {result.attempt.accuracy_percentage}%
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 pt-10">
          <Button onClick={() => router.push("/dashboard")} className="bg-slate-900 text-white hover:bg-slate-800 px-8">Dashboard</Button>
          <Button variant="outline" onClick={() => router.push(`/quiz/${result.quiz.share_uuid}`)} className="border-slate-200 text-slate-600 hover:bg-slate-50 px-8">Retake Quiz</Button>
        </CardFooter>
      </Card>

      <div className="max-w-2xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">Review Answers</h3>
        {result.attempt.user_answers?.map((ans: any, idx: number) => (
          <Card key={idx} className={`p-6 border ${ans.is_correct ? "border-green-100 bg-green-50/20" : "border-red-100 bg-red-50/20"}`}>
            <div className="space-y-4">
              <p className="font-semibold text-lg text-slate-900">{idx + 1}. {ans.question_text}</p>
              <div className="space-y-2">
                <p className={`text-sm ${ans.is_correct ? "text-green-700" : "text-red-700"} font-medium`}>
                  Your Answer: {ans.selected_option} — {ans.is_correct ? "Correct" : "Incorrect"}
                </p>
                {!ans.is_correct && (
                  <p className="text-sm text-slate-600">
                    Correct Answer: <span className="font-bold text-green-700">{ans.correct_option}</span>
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
