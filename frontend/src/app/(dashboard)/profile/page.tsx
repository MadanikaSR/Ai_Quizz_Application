"use client";

import Link from "next/link";
import { 
  PlusCircle, 
  BarChart3, 
  Target, 
  ShieldCheck, 
  Settings,
  Mail,
  User as UserIcon,
  Crown,
  Sparkles,
  Zap,
  Globe,
  Bell,
  Trash2,
  LogOut,
  Brain
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 overflow-hidden">
      {/* Premium Profile Header */}
      <section className="relative p-10 md:p-14 bg-white dark:bg-slate-900 rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
             <div className="h-40 w-40 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-6xl font-black shadow-2xl shadow-blue-600/30 transform transition-transform hover:scale-105 active:scale-95 duration-500">
               {user?.username?.substring(0, 2).toUpperCase() || "U"}
             </div>
             <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border-4 border-slate-50 dark:border-slate-900">
                <Crown className="h-6 w-6 text-yellow-500" />
             </div>
          </div>
          
          <div className="text-center md:text-left space-y-4 flex-1">
            <div className="space-y-1">
               <Badge className="bg-blue-500/10 text-blue-600 border-none font-black text-[10px] tracking-widest px-3 py-1 mb-2">MASTER ACCOUNT</Badge>
               <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">{user?.username}</h1>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2 font-medium">
              <div className="flex items-center text-slate-500 gap-2">
                 <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <Mail className="h-4 w-4" />
                 </div>
                 {user?.email}
              </div>
              <div className="flex items-center text-slate-500 gap-2">
                 <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                 </div>
                 Verified Sequence Explorer
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 self-stretch md:self-center justify-center">
             <Button variant="outline" size="lg" className="h-14 px-8 rounded-2xl border-slate-200 dark:border-slate-800 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all">
                <Settings className="h-4 w-4 mr-3" />
                Control Panel
             </Button>
             <Button variant="ghost" size="lg" className="h-14 px-8 rounded-2xl text-red-500 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all" onClick={logout}>
                <LogOut className="h-4 w-4 mr-3" />
                De-Authorize
             </Button>
          </div>
        </div>
        
        {/* Background Visuals */}
        <div className="absolute -top-10 right-0 opacity-20 pointer-events-none">
           <Brain className="h-64 w-64 text-slate-200 dark:text-slate-800 transform rotate-12" />
        </div>
        <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Achievements & Stats */}
         <Card className="lg:col-span-7 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden p-10">
            <CardHeader className="p-0 pb-10">
               <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-100 dark:border-blue-900/30">
                     <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                     <CardTitle className="text-2xl font-black">Performance Matrix</CardTitle>
                     <CardDescription className="text-sm font-medium">Your global contribution and analytics overview.</CardDescription>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-6">
               <StatItem icon={PlusCircle} label="Neural Quizzes" value="12" color="blue" />
               <StatItem icon={Target} label="Avg Accuracy" value="84%" color="green" />
               <StatItem icon={Zap} label="Learning Streak" value="3 Days" color="amber" />
               <StatItem icon={Globe} label="Global Impact" value="Rank 42" color="purple" />
            </CardContent>
         </Card>

         {/* Configuration Side */}
         <div className="lg:col-span-5 space-y-10">
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden p-10">
               <div className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-50 dark:border-slate-700">
                        <Sparkles className="h-6 w-6" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight">System Adjustments</h3>
                  </div>

                  <div className="space-y-6">
                     <ToggleItem 
                        title="AI Adaptive Mode" 
                        description="Automatically adjust difficulty based on performance history."
                        active={true}
                     />
                     <ToggleItem 
                        title="Neural Notifications" 
                        description="Receive alerts when new subjects are provisioned."
                        active={false}
                     />
                     <ToggleItem 
                        title="Public Insights" 
                        description="Share high-level progress with the explorer network."
                        active={true}
                     />
                  </div>
               </div>
            </Card>

            <div className="flex flex-col gap-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center">Protocol Management</p>
               <Button variant="ghost" className="h-14 w-full rounded-2xl text-slate-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest text-[10px]">
                  <Trash2 className="h-4 w-4 mr-3" />
                  Wipe Core Memory (Reset Data)
               </Button>
            </div>
         </div>
      </div>

      <div className="text-center pt-10">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Member Established: Cycle 2026.03</p>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color }: any) {
   const variants: any = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      green: "bg-green-50 text-green-600 border-green-100",
      amber: "bg-amber-50 text-amber-600 border-amber-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100"
   };

   return (
      <div className="p-8 rounded-[40px] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 group hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-xl">
         <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 ${variants[color]}`}>
            <Icon className="h-6 w-6" />
         </div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
         <h4 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">{value}</h4>
      </div>
   );
}

function ToggleItem({ title, description, active }: any) {
   return (
      <div className="flex items-center justify-between group cursor-pointer">
         <div className="space-y-1 max-w-[80%]">
            <h4 className="font-black text-sm uppercase tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{title}</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">{description}</p>
         </div>
         <div className={`h-8 w-14 rounded-full p-1.5 transition-colors relative ${active ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`}>
            <div className={`h-5 w-5 bg-white rounded-full shadow-lg transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
         </div>
      </div>
   );
}
