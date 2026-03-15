'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/axios';

export default function LeaderboardPage() {
  const { uuid } = useParams();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [lbRes, quizRes] = await Promise.all([
          api.get(`quizzes/${uuid}/leaderboard/`),
          api.get(`quizzes/${uuid}/`)
        ]);
        setLeaderboard(lbRes.data);
        setQuizDetails(quizRes.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (uuid) fetchLeaderboard();
  }, [uuid]);

  if (isLoading) return <div className="p-8 text-center">Loading leaderboard...</div>;
  if (!quizDetails) return <div className="p-8 text-center text-red-500">Quiz not found.</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Group Leaderboard</CardTitle>
          <CardDescription className="text-lg">
            {quizDetails.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/quiz/${uuid}`)}>
              Back to Quiz
            </Button>
            <Button onClick={() => router.push(`/quiz/${uuid}/take`)}>
              Challenge Now
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Date Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                    No one has completed this quiz yet. Be the first!
                  </TableCell>
                </TableRow>
              ) : (
                leaderboard.map((entry: any, index: number) => (
                  <TableRow key={index} className={index === 0 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}>
                    <TableCell className="font-bold">
                      {index === 0 ? '👑 1' : index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{entry.username}</TableCell>
                    <TableCell className="font-bold text-primary">{entry.score}%</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
