"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PlusCircle, 
  LineChart, 
  History, 
  Library,
  Settings,
  Brain,
  ChevronRight,
  Sparkles,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create Quiz", href: "/create-quiz", icon: PlusCircle },
  { name: "My Library", href: "/my-quizzes", icon: Library },
  { name: "Quiz History", href: "/history", icon: History },
  { name: "Performance", href: "/analytics", icon: LineChart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900 w-72 transition-all duration-500 overflow-hidden group/sidebar">
      {/* Premium Branding */}
      <div className="p-8 pb-10">
        <Link href="/dashboard" className="flex items-center gap-4 group/logo">
          <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-3">
             <Brain className="h-7 w-7 text-blue-400" />
          </div>
          <div className="flex flex-col">
             <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">QuizPro AI</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mt-1">Neural Engine</span>
          </div>
        </Link>
      </div>

      {/* Navigation Space */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all relative overflow-hidden",
                isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                  : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110 duration-300",
                isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
              )} />
              <span className="uppercase tracking-widest text-[11px] flex-1">{item.name}</span>
              {isActive && (
                 <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              )}
              {!isActive && (
                 <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              )}
              
              {isActive && (
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Session Block */}
      <div className="p-6 mt-auto">
         <div className="p-6 rounded-[32px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                  {user?.username?.substring(0, 1).toUpperCase() || "U"}
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">{user?.username}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                     <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                     Explorer
                  </span>
               </div>
            </div>
            
            <Link href="/profile">
               <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">
                  View Profile
               </Button>
            </Link>
         </div>
      </div>

      {/* Decorative Floor */}
      <div className="px-8 pb-8 text-center">
         <div className="flex items-center justify-center gap-2 opacity-30 grayscale group-hover/sidebar:grayscale-0 group-hover/sidebar:opacity-100 transition-all duration-700">
            <Sparkles className="h-3 w-3 text-blue-500" />
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Powered by AI</span>
         </div>
      </div>
    </div>
  );
}
