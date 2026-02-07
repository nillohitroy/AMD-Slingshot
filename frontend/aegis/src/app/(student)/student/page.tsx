"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { ShieldCheck, AlertTriangle, Download, CheckCircle2, ChevronRight, Zap, Loader2, Globe, Shield, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DashboardData {
  first_name: string;
  risk_score: number;
  streak_count: number;
  extension_installed: boolean;
  pending_actions: any[];
  recent_activity: any[];
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in-up">
      {/* Score Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 rounded-2xl p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-48 h-48 rotate-12" /></div>
           <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
              <div className="relative h-32 w-32 flex-shrink-0">
                 <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-muted" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <motion.path 
                      initial={{ pathLength: 0 }} animate={{ pathLength: data.risk_score / 100 }} transition={{ duration: 1.5 }}
                      className={cn(data.risk_score > 80 ? "text-emerald-500" : "text-amber-500")}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100"
                    />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold font-mono">{data.risk_score}</span>
                 </div>
              </div>
              <div className="text-center sm:text-left">
                 <h1 className="text-2xl font-bold mb-2">Hello, {data.first_name}.</h1>
                 <p className="text-muted-foreground">Keep your score high to stay safe.</p>
                 <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium px-3 py-1 bg-background/50 rounded-full border border-border">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" /> {data.streak_count} Day Streak
                 </div>
              </div>
           </div>
        </div>

        {/* Extension Card */}
        <div className="bg-background border border-border rounded-2xl p-6 flex flex-col justify-between">
           <div>
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                 {data.extension_installed ? <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active</> : <><AlertTriangle className="w-4 h-4 text-amber-500" /> Inactive</>}
              </h3>
              <p className="text-sm text-muted-foreground">{data.extension_installed ? "Browser guarded." : "Install extension now."}</p>
           </div>
           <div className="mt-6">
              <button className={cn("w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border transition-colors", data.extension_installed ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground animate-pulse")}>
                 <Download className="w-3 h-3" /> {data.extension_installed ? "Check Updates" : "Install Now"}
              </button>
           </div>
        </div>
      </div>

      {/* Pending Actions */}
      {data.pending_actions.length > 0 && (
          <div>
             <h2 className="text-lg font-bold mb-4">Pending Actions</h2>
             <div className="grid gap-4">
                {data.pending_actions.map((action: any) => (
                    <div key={action.id} className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500"><AlertTriangle className="w-5 h-5" /></div>
                          <div>
                             <h3 className="font-semibold text-sm">{action.threat_signature}</h3>
                             <p className="text-xs text-muted-foreground">{action.time_ago} • {action.target_url}</p>
                          </div>
                       </div>
                       <Link href={`/student/history`} className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600">Review</Link>
                    </div>
                ))}
             </div>
          </div>
      )}

      {/* Recent Activity */}
      <div>
         <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <Link href="/student/history" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ChevronRight className="w-3 h-3" /></Link>
         </div>
         <div className="border border-border rounded-xl overflow-hidden bg-background">
            {data.recent_activity.map((item: any) => (
               <div key={item.id} className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-muted/20">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-muted rounded-lg"><Shield className="w-4 h-4 text-muted-foreground" /></div>
                     <div><div className="text-sm font-medium">{item.threat_signature}</div><div className="text-xs text-muted-foreground">{item.target_url}</div></div>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.time_ago}</div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}