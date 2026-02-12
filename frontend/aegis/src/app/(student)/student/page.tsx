"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Shield, 
  Flame,
  Trophy,
  ExternalLink,
  Ban
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "THREAT" | "DRILL";
  title: string;
  subtitle: string;
  status: string;
  timestamp: string;
  xp_change: number;
}

interface DashboardData {
  first_name: string;
  risk_score: number;
  streak_count: number;
  xp: number; 
  extension_installed: boolean;
  pending_actions: any[];
  recent_activity: ActivityItem[]; 
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/student/dashboard/")
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  if (!data) return null;

  // Color logic for Risk Score
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 fade-in-up pb-10">
      
      {/* 1. HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl">
         {/* Background Glow */}
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
         
         <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
            {/* Left: Welcome & Stats */}
            <div className="md:col-span-2 space-y-6">
               <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                     Welcome back, {data.first_name}.
                  </h1>
                  <p className="text-zinc-400">
                     Your digital footprint is being monitored. Stay vigilant.
                  </p>
               </div>
               {/* Stats Badges */}
               <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-3 bg-zinc-950/50 border border-zinc-800 backdrop-blur-md px-4 py-2 rounded-xl group hover:border-orange-500/30 transition-colors">
                     <div className="h-8 w-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500">
                        <Flame className="w-5 h-5 fill-current" />
                     </div>
                     <div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Streak</div>
                        <div className="text-lg font-mono font-bold text-white leading-none">{data.streak_count}</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-950/50 border border-zinc-800 backdrop-blur-md px-4 py-2 rounded-xl group hover:border-yellow-500/30 transition-colors">
                     <div className="h-8 w-8 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-500">
                        <Trophy className="w-5 h-5 fill-current" />
                     </div>
                     <div>
                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">XP</div>
                        <div className="text-lg font-mono font-bold text-white leading-none">{data.xp || 0}</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right: Circular Risk Score */}
            <div className="flex flex-col items-center justify-center relative">
               <div className="relative h-40 w-40">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                     <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                     <motion.path 
                        initial={{ pathLength: 0 }} 
                        animate={{ pathLength: data.risk_score / 100 }} 
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn(getRiskColor(data.risk_score), "drop-shadow-md")}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" strokeLinecap="round"
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className={cn("text-4xl font-bold font-mono", getRiskColor(data.risk_score))}>{data.risk_score}</span>
                     <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-1">Risk Score</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* 2. EXTENSION STATUS */}
        <div className="md:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors">
           <div>
              <div className="flex items-center justify-between mb-4">
                 <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400">
                    <Shield className="w-5 h-5" />
                 </div>
                 <span className={cn("px-2 py-1 rounded-full text-xs font-bold border", data.extension_installed ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20")}>
                    {data.extension_installed ? "ACTIVE" : "MISSING"}
                 </span>
              </div>
              <h3 className="font-bold text-white text-lg">Browser Guard</h3>
              <p className="text-sm text-zinc-400 mt-1">
                 {data.extension_installed ? "Your browser traffic is currently protected by Aegis." : "Install the extension to enable real-time threat blocking."}
              </p>
           </div>
           
           {/* UPDATED: Link to Install Page */}
           {!data.extension_installed && (
              <Link 
                href="/install"
                className="mt-6 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                 <Download className="w-4 h-4" /> Install Extension
              </Link>
           )}

           {data.extension_installed && (
               <div className="mt-6 w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-sm font-medium flex items-center justify-center gap-2 cursor-default">
                   <CheckCircle2 className="w-4 h-4" /> Protected
               </div>
           )}
        </div>

        {/* 3. RECENT ACTIVITY LIST */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-zinc-500" /> Recent Activity
                </h3>
                {/* Fixed Link to History */}
                <Link href="/history" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-medium transition-colors">
                    View Full Log <ExternalLink className="w-3 h-3" />
                </Link>
            </div>
            
            <div className="divide-y divide-zinc-800">
                {data.recent_activity.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 text-sm">No recent activity recorded.</div>
                ) : (
                    data.recent_activity.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                            {/* Dynamic Icon */}
                            <div className={cn(
                                "p-2 rounded-lg",
                                item.type === 'THREAT' 
                                  ? "bg-red-500/10 text-red-500" 
                                  : "bg-emerald-500/10 text-emerald-500"
                            )}>
                                {item.type === 'THREAT' ? <Ban className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
                            </div>
                            
                            <div>
                                <div className="text-sm font-medium text-zinc-200">
                                    {item.title} 
                                    {item.xp_change > 0 && <span className="ml-2 text-[10px] text-amber-500 font-bold">+{item.xp_change} XP</span>}
                                </div>
                                <div className="text-xs text-zinc-500 truncate max-w-[200px]">
                                    {item.subtitle}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                           <div className="text-xs text-zinc-500 font-mono">
                              {new Date(item.timestamp).toLocaleDateString()}
                           </div>
                        </div>
                    </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
}