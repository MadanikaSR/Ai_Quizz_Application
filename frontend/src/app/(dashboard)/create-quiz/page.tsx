"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sparkles, 
  Brain, 
  ChevronRight, 
  LayoutGrid, 
  Zap,
  Target,
  Wand2,
  Clock3,
  Search
} from "lucide-react";
import api from "@/lib/axios";

function CreateQuizContent() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState("10");
  const [categoryId, setCategoryId] = useState<string>("none");
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get("categories/");
        setCategories(res.data);
        const urlCat = searchParams.get("category");
        if (urlCat) setCategoryId(urlCat);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, [searchParams]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;
    setIsLoading(true);

    try {
      const res = await api.post("quizzes/generate/", {
        topic,
        difficulty,
        num_questions: numQuestions,
        category_id: categoryId === "none" ? null : categoryId,
      });
      router.push(`/quiz/${res.data.share_uuid}`);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to generate quiz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Card className="max-w-xl mx-auto shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create Quiz</CardTitle>
          <CardDescription>Enter a topic and we'll generate the questions for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. Solar System, React Hooks..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="border-slate-200 focus:border-slate-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty" className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="numQuestions">Questions</Label>
                <Select value={numQuestions} onValueChange={setNumQuestions}>
                  <SelectTrigger id="numQuestions" className="border-slate-200">
                     <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category (Optional)</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category" className="border-slate-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">General / None</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 transition-colors py-6" disabled={isLoading || !topic}>
              {isLoading ? "Generating..." : "Create Quiz"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreateQuizPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-10 w-10 border-4 border-slate-200 border-t-slate-900 animate-spin rounded-full" />
        <p className="text-sm text-slate-500 font-medium">Preparing quiz builder...</p>
      </div>
    }>
      <CreateQuizContent />
    </Suspense>
  );
}
