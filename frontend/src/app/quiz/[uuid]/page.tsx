"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function QuizOverviewPage() {
  const { uuid } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`quizzes/${uuid}/`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (uuid) fetchQuiz();
  }, [uuid]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleStart = () => {
     router.push(`/quiz/${uuid}/take`);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="h-10 w-10 border-4 border-slate-200 border-t-slate-900 animate-spin rounded-full" />
          <p className="text-sm text-slate-500 font-medium">Preparing quiz details...</p>
        </div>
      </>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <AlertCircle className="h-12 w-12 text-black mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-black mb-2">Quiz not found</h1>
          <p className="text-slate-500 mb-8 text-sm">This quiz may have been removed or the link is incorrect.</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-black text-white hover:bg-slate-800 rounded-none px-8">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-16">
        <Card className="shadow-none border border-black rounded-none">
          <CardHeader className="pb-6 border-b border-slate-100">
            <CardTitle className="text-2xl font-bold tracking-tight text-black">
              Quiz Details
            </CardTitle>
            <CardDescription className="text-base text-slate-500 mt-1 uppercase tracking-wider font-medium">
              {quiz.title}
            </CardDescription>
          </CardHeader>

          <CardContent className="py-8 space-y-8">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Category</span>
                <span className="text-black font-semibold">{quiz.category?.name || "General"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Difficulty</span>
                <span className="text-black font-semibold capitalize">{quiz.difficulty}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Questions</span>
                <span className="text-black font-semibold">{quiz.questions.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Time Limit</span>
                <span className="text-black font-semibold">{quiz.time_limit_minutes} minutes</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-black uppercase tracking-widest">Share Quiz</h4>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600 font-mono overflow-hidden">
                  {typeof window !== 'undefined' ? window.location.href : '...'}
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleCopy} 
                  className="border-black rounded-none text-xs hover:bg-black hover:text-white transition-colors"
                >
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-10 px-8">
            {!user ? (
               <div className="w-full text-center space-y-4">
                  <p className="text-slate-500 text-xs">Please login to start this quiz.</p>
                  <Button onClick={() => router.push("/login")} className="w-full bg-black text-white hover:bg-slate-800 rounded-none py-4 text-sm font-bold uppercase tracking-widest">
                    Login to Start
                  </Button>
               </div>
            ) : (
               <Button 
                onClick={handleStart}
                className="w-full bg-black text-white hover:bg-slate-800 rounded-none py-6 text-sm font-bold uppercase tracking-widest"
               >
                  Start Quiz
               </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')} 
              className="w-full border-black text-black rounded-none py-6 text-sm font-bold uppercase tracking-widest hover:bg-slate-50"
            >
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}

import Link from "next/link";
