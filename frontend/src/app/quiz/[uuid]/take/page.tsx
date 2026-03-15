"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

export default function TakeQuizPage() {
  const { uuid } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const [quizRes, attemptRes] = await Promise.all([
          api.get(`quizzes/${uuid}/`),
          api.post(`quizzes/${uuid}/start/`)
        ]);
        
        const quizData = quizRes.data;
        setQuiz(quizData);
        setAttemptId(attemptRes.data.attempt_id);

        // Timer initialization
        const timerKey = `quiz_start_${uuid}`;
        let startTime = localStorage.getItem(timerKey);
        
        if (!startTime) {
          startTime = Date.now().toString();
          localStorage.setItem(timerKey, startTime);
        }

        const totalSeconds = quizData.time_limit_minutes * 60;
        const elapsedSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsedSeconds);
        
        setTimeLeft(remaining);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (uuid) initializeQuiz();
  }, [uuid]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isSubmitting) {
      if (timeLeft === 0 && !isSubmitting) {
        submitQuiz();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitting]);

  const handleSelectOption = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    // Clear timer persistence on submission
    localStorage.removeItem(`quiz_start_${uuid}`);

    const answersPayload = Object.entries(answers).map(([qId, opt]) => ({
      question_id: parseInt(qId),
      selected_option: opt
    }));

    try {
      const res = await api.post(`quizzes/${uuid}/submit/`, { 
        answers: answersPayload,
        attempt_id: attemptId
      });
      router.push(`/quiz/${uuid}/results/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (isLoading || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-slate-900 animate-spin rounded-full" />
        <p className="text-sm text-slate-500 font-medium">Preparing quiz...</p>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const question = quiz.questions[currentIdx];
  const isLastQuestion = currentIdx === quiz.questions.length - 1;
  const isSelected = !!answers[question.id];
  const isTimeLow = timeLeft !== null && timeLeft < 60;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Timer UI */}
        <div className="flex justify-between items-center py-4 border-b border-black sticky top-0 bg-white z-10">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-black uppercase tracking-widest">Time Remaining</span>
            <span className={`text-2xl font-mono font-bold ${isTimeLow ? 'text-red-700' : 'text-black'}`}>
              {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
            </span>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-black uppercase tracking-widest">Question</p>
            <p className="text-lg font-bold text-black">{currentIdx + 1} / {quiz.questions.length}</p>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          <span>{quiz.category?.name || "General"} • {quiz.difficulty}</span>
          <span>{quiz.title}</span>
        </div>

        <Card className="shadow-none border border-black rounded-none">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl font-bold leading-tight text-black">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["A", "B", "C", "D"].map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectOption(question.id, opt)}
                className={`w-full p-6 text-left border transition-all flex items-center gap-4 ${
                  answers[question.id] === opt
                    ? "border-black bg-black text-white font-bold"
                    : "border-slate-200 hover:border-black text-black"
                }`}
              >
                <span className={`h-8 w-8 flex items-center justify-center border border-current font-bold ${
                  answers[question.id] === opt ? "bg-white text-black" : ""
                }`}>{opt}</span>
                <span className="text-lg">{question[`option_${opt.toLowerCase()}`]}</span>
              </button>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end p-8 border-t border-slate-100">
            <Button 
              onClick={handleNext} 
              disabled={(!isSelected && !isTimeLow) || isSubmitting}
              className="bg-black text-white hover:bg-slate-800 rounded-none px-12 py-6 text-sm font-bold uppercase tracking-widest transition-all"
            >
              {isSubmitting ? "Submitting..." : isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
