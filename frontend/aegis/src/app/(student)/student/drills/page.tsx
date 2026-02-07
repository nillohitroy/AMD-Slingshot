"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Play, CheckCircle2, Trophy, Clock, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Define the Data Shape
interface Drill {
  id: number;
  title: string;
  description: string;
  category: string;
  xp_reward: number;
  is_mandatory: boolean;
  status: "PENDING" | "COMPLETED" | "NOT_STARTED";
}

export default function StudentDrillsPage() {
  // 2. Initialize with an EMPTY ARRAY [] to prevent initial render errors
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrills = async () => {
      try {
        const res = await api.get("/student/drills/");
        
        // 3. THE FIX: Check if response is an array or a paginated object
        // If 'res.data' is an array, use it. 
        // If it's an object with a 'results' key (Django pagination), use that.
        // Otherwise, fallback to empty array.
        const safeData = Array.isArray(res.data) 
          ? res.data 
          : (res.data.results || []);
          
        setDrills(safeData);
      } catch (err) {
        console.error("Failed to load drills:", err);
        setDrills([]); // Fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchDrills();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  // 4. Safe Filtering
  const mandatoryDrills = drills.filter(d => d.is_mandatory && d.status !== 'COMPLETED');
  const otherDrills = drills.filter(d => !d.is_mandatory || d.status === 'COMPLETED');

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold mb-2">Training Center</h1>
        <p className="text-muted-foreground">Complete these modules to boost your Aegis Score.</p>
      </div>

      {/* 1. Active Assignments (Priority) */}
      {mandatoryDrills.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Action Required</h2>
          <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
             {mandatoryDrills.map((drill) => (
               <div key={drill.id} className="p-6 border-b border-border last:border-0 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="h-14 w-14 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                     <Lock className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{drill.title}</h3>
                        <span className="bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Mandatory</span>
                     </div>
                     <p className="text-sm text-muted-foreground max-w-xl">
                        {drill.description}
                     </p>
                     <div className="flex items-center gap-4 mt-3 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 mins</span>
                        <span>•</span>
                        <span>{drill.xp_reward} XP Reward</span>
                     </div>
                  </div>
                  <button className="w-full md:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                     <Play className="w-4 h-4 fill-current" /> Start Lesson
                  </button>
               </div>
             ))}
          </div>
        </section>
      )}

      {/* 2. Library / Optional */}
      <section>
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Available Modules</h2>
           <span className="text-xs text-muted-foreground">Level 4 Scholar</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
           {otherDrills.map((drill) => (
             <div 
                key={drill.id} 
                className={cn(
                  "group bg-background border border-border rounded-2xl p-6 transition-all",
                  drill.status === 'COMPLETED' ? "bg-muted/20 opacity-70" : "hover:border-primary/50 cursor-pointer"
                )}
             >
                <div className="flex justify-between items-start mb-4">
                   <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      drill.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                   )}>
                      {drill.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                   </div>
                   {drill.status === 'COMPLETED' ? (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                        Completed <CheckCircle2 className="w-3 h-3" />
                      </span>
                   ) : (
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded">Optional</span>
                   )}
                </div>
                
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">{drill.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{drill.description}</p>
                
                {drill.status !== 'COMPLETED' && (
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-0 group-hover:w-full transition-all duration-700" />
                  </div>
                )}
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}