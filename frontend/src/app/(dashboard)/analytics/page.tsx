"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Layers, 
  Zap, 
  Brain, 
  Calendar,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  TrendingDown,
  Clock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("analytics/");
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 animate-spin rounded-full shadow-lg shadow-blue-600/10" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Synthesizing Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 overflow-hidden">
      {/* Analytics Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8">
        <div className="space-y-3">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3" />
              Intelligence Dashboard
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
             Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Performance</span>
           </h1>
           <p className="text-slate-500 text-lg font-medium max-w-lg">
             A granular breakdown of your knowledge retention and subject mastery across all attempted domains.
           </p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
           <Button variant="ghost" className="rounded-xl px-6 h-10 font-black text-xs uppercase tracking-widest bg-white dark:bg-slate-700 shadow-sm">Overtime</Button>
           <Button variant="ghost" className="rounded-xl px-6 h-10 font-black text-xs uppercase tracking-widest text-slate-500">Subject Wise</Button>
        </div>
      </section>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard 
            title="Global Accuracy" 
            value={`${analytics?.overall_accuracy}%`} 
            trend="+2.4%" 
            icon={Target} 
            color="blue"
         />
         <KPICard 
            title="Quiz Volume" 
            value={analytics?.total_quizzes} 
            trend="+12%" 
            icon={Layers} 
            color="indigo"
         />
         <KPICard 
            title="Avg. Time" 
            value="4.5m" 
            trend="-30s" 
            icon={Clock} 
            color="purple"
         />
         <KPICard 
            title="Active Streaks" 
            value="3 Days" 
            trend="New" 
            icon={Zap} 
            color="amber"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Performance Breakdown Table */}
         <Card className="lg:col-span-8 border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden">
            <CardHeader className="p-8 pb-4">
               <CardTitle className="text-2xl font-black flex items-center">
                  <TrendingUp className="mr-3 h-6 w-6 text-blue-500" />
                  Knowledge Matrix
               </CardTitle>
               <CardDescription className="text-base font-medium">Comparative analysis of your performance across different disciplines.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
               <div className="space-y-8">
                  {analytics?.category_performance.map((cat: any, idx: number) => (
                     <div key={idx} className="space-y-4 group">
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">{cat.category}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.total_attempts} Sessions Completed</p>
                           </div>
                           <div className="text-right">
                              <span className="text-2xl font-black text-blue-600">{cat.avg_accuracy}%</span>
                           </div>
                        </div>
                        <div className="relative h-4 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800/50">
                           <div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                              style={{ width: `${cat.avg_accuracy}%` }}
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         {/* AI Strategy Insights */}
         <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-2xl bg-slate-900 text-white p-8 rounded-[40px] relative overflow-hidden flex flex-col min-h-[400px]">
               <div className="relative z-10 space-y-8 flex-1">
                  <div className="flex items-center gap-3">
                     <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center border border-white/10 shadow-2xl shadow-blue-600/20">
                        <Brain className="h-6 w-6 text-white" />
                     </div>
                     <h3 className="text-xl font-black tracking-tight">AI Diagnostic</h3>
                  </div>

                  <div className="space-y-6">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Primary Strength</p>
                        <p className="text-2xl font-bold leading-tight">{analytics?.insights?.strength || "Computing Data..."}</p>
                     </div>

                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Growth Opportunity</p>
                        <p className="text-2xl font-bold leading-tight line-clamp-2">{analytics?.insights?.weakness || "Analysis Pending..."}</p>
                     </div>

                     <div className="pt-6 border-t border-white/10">
                        <p className="text-slate-400 font-medium leading-relaxed italic opacity-90 text-sm">
                           "{analytics?.insights?.recommendation}"
                        </p>
                     </div>
                  </div>
               </div>
               
               <Button className="mt-8 h-14 w-full bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs relative z-10 transition-all hover:scale-[1.02]">
                  Reinforce Weaknesses
               </Button>
               
               <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-blue-600/10 rounded-full blur-[100px]" />
               <div className="absolute top-0 left-0 h-40 w-40 bg-indigo-600/5 rounded-full blur-[80px]" />
            </Card>

            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 p-8 rounded-[40px] flex flex-col border border-slate-100 dark:border-slate-800/50">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter">Consistency Tracking</h3>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
               </div>
               <div className="flex gap-2">
                  {[1,2,3,4,5,6,7].map(day => (
                     <div key={day} className={`flex-1 aspect-square rounded-lg ${day < 4 ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'} transition-all hover:scale-110 shadow-sm`} />
                  ))}
               </div>
               <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active learning streak detected</p>
            </Card>
         </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, icon: Icon, color }: any) {
  const colorMap: any = {
    blue: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    indigo: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20",
    purple: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
    amber: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
  };

  const isUp = trend.startsWith('+');
  const isNew = trend === 'New';

  return (
    <Card className="border-none shadow-xl bg-white dark:bg-slate-900 p-8 rounded-[40px] hover:shadow-2xl transition-all group relative overflow-hidden">
       <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
             <div className={`p-4 rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6" />
             </div>
             {trend && (
               <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isNew ? 'bg-indigo-100 text-indigo-600' : isUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {!isNew && (isUp ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />)}
                  {trend}
               </div>
             )}
          </div>
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{title}</p>
             <h2 className="text-4xl font-black text-slate-800 dark:text-white leading-none tracking-tighter">{value || 0}</h2>
          </div>
       </div>
    </Card>
  );
}
