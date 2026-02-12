"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  History, 
  ShieldAlert, 
  Trophy, 
  Search, 
  Clock, 
  Filter,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "THREAT" | "DRILL";
  title: string;
  subtitle: string;
  status: string;
  timestamp: string;
  xp_change: number;
}

export default function StudentHistoryPage() {
  const [logs, setLogs] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reuse the dashboard endpoint or create a dedicated /history/ endpoint
    // For now, we reuse the dashboard's robust list
    api.get("/student/dashboard/").then(res => {
        setLogs(res.data.recent_activity);
        setLoading(false);
    });
  }, []);

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in-up pb-10">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
               <History className="w-6 h-6 text-primary" /> Activity Log
            </h1>
            <p className="text-muted-foreground">Your recent security events and training achievements.</p>
         </div>
         {/* Simple Filter Visual */}
         <button className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted">
            <Filter className="w-4 h-4" /> Filter
         </button>
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
         <div className="divide-y divide-border">
            {logs.length === 0 ? (
               <div className="p-12 text-center text-muted-foreground">
                  No recent activity found.
               </div>
            ) : (
               logs.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                     <div className="flex items-center gap-4">
                        {/* ICON LOGIC */}
                        <div className={cn(
                           "h-12 w-12 rounded-full flex items-center justify-center border-4 border-background shadow-sm",
                           item.type === 'THREAT' ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                        )}>
                           {item.type === 'THREAT' ? <ShieldAlert className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                        </div>
                        
                        <div>
                           <div className="font-semibold text-foreground flex items-center gap-2">
                              {item.title}
                              {item.xp_change > 0 && (
                                 <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded border border-amber-500/20">
                                    +{item.xp_change} XP
                                 </span>
                              )}
                           </div>
                           <div className="text-xs text-muted-foreground font-mono mt-0.5 truncate max-w-[250px] md:max-w-md">
                              {item.subtitle}
                           </div>
                        </div>
                     </div>

                     <div className="text-right">
                        <div className={cn(
                           "text-xs font-bold uppercase tracking-wider mb-1",
                           item.status === 'BLOCKED' ? "text-red-500" : "text-emerald-500"
                        )}>
                           {item.status}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                           <Clock className="w-3 h-3" />
                           {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
}