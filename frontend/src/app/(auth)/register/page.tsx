"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/axios";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.post('auth/register/', { username, email, password });
      alert("Registration successful! Please login.");
      router.push('/login');
    } catch (err: any) {
      console.error(err);
      const detail = err.response?.data?.detail || err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || "Registration failed.";
      alert(detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <Card className="w-full max-w-md shadow-sm border-slate-200">
        <CardHeader className="text-center space-y-1 pb-8">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create account</CardTitle>
          <CardDescription className="text-slate-500">
            Join the AI Quiz App
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-slate-200 focus:border-slate-400 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-200 focus:border-slate-400 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-200 focus:border-slate-400 transition-colors"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-slate-900 text-white hover:bg-slate-800 transition-colors py-6" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-100 py-6">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-slate-900 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
