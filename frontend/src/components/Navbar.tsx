"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, PlusCircle, History, LogOut, Brain } from "lucide-react";

export default function Navbar() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Quiz", href: "/create-quiz", icon: PlusCircle },
    { name: "History", href: "/history", icon: History },
  ];

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-slate-900">
            AI Quiz App
          </Link>

          <div className="flex items-center gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                  isActive ? "text-slate-900" : "text-slate-500"
                }`}>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
