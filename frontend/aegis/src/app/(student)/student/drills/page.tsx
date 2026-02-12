"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation"; // 1. Import Router
import { Play, CheckCircle2, Trophy, Clock, Lock, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the Data Shape
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
  const router = useRouter(); // 2. Initialize Router
  const [drills, setDrills] = useState<Drill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrills = async () => {
      try {
        const res = await api.get("/student/drills/");
        const safeData = Array.isArray(res.data) 
          ? res.data 
          : (res.data.results || []);
          
        setDrills(safeData);
      } catch (err) {
        console.error("Failed to load drills:", err);
        setDrills([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchDrills();
  }, []);

  // 3. Navigation Handler
  const handleStartDrill = (id: number) => {
    // Navigate to the Drill Player page
    router.push(`/student/drills/${id}`);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  // Filter Drills
  const mandatoryDrills = drills.filter(d => d.is_mandatory && d.status !== 'COMPLETED');
  const otherDrills = drills.filter(d => !d.is_mandatory || d.status === 'COMPLETED');

  return (
    <div className="max-w-4xl mx-auto space-y-8 fade-in-up pb-10">
      <div>
        <h1 className="text-2xl font-bold mb-2">Training Center</h1>
        <p className="text-muted-foreground">Complete these modules to boost your Aegis Score.</p>
      </div>

      {/* 1. Active Assignments (Priority) */}
      {mandatoryDrills.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Action Required</h2>
          <div className="space-y-4">
             {mandatoryDrills.map((drill) => (
               <div key={drill.id} className="bg-background border border-amber-500/30 rounded-2xl overflow-hidden shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative group">
                  {/* Glowing Effect for Priority */}
                  <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
                  
                  <div className="h-14 w-14 bg-amber-500/20 text-amber-600 rounded-xl flex items-center justify-center shrink-0 z-10">
                     <Lock className="w-7 h-7" />
                  </div>
                  <div className="flex-1 z-10">
                     <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{drill.title}</h3>
                        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Mandatory</span>
                     </div>
                     <p className="text-sm text-muted-foreground max-w-xl">
                        {drill.description}
                     </p>
                     <div className="flex items-center gap-4 mt-3 text-xs font-medium text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~5 mins</span>
                        <span>•</span>
                        <span className="text-amber-600 font-bold">+{drill.xp_reward} XP Reward</span>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleStartDrill(drill.id)}
                    className="z-10 w-full md:w-auto px-6 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95"
                  >
                     <Play className="w-4 h-4 fill-current" /> Start Lesson
                  </button>
               </div>
             ))}
          </div>
        </section>
      ) : (
        <div className="p-6 border border-border rounded-2xl bg-muted/20 text-center">
            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-bold">All caught up!</h3>
            <p className="text-sm text-muted-foreground">No mandatory drills pending.</p>
        </div>
      )}

      {/* 2. Library / Optional */}
      <section>
        <div className="flex items-center justify-between mb-4 mt-8">
           <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Available Modules</h2>
        </div>
        
        {otherDrills.length === 0 ? (
            <div className="text-muted-foreground text-sm italic">No optional modules available yet.</div>
        ) : (
            <div className="grid md:grid-cols-2 gap-4">
            {otherDrills.map((drill) => (
                <div 
                    key={drill.id} 
                    onClick={() => drill.status !== 'COMPLETED' && handleStartDrill(drill.id)}
                    className={cn(
                        "group bg-background border border-border rounded-2xl p-6 transition-all relative overflow-hidden",
                        drill.status === 'COMPLETED' 
                            ? "bg-muted/30 opacity-60 cursor-default" 
                            : "hover:border-primary/50 hover:shadow-md cursor-pointer bg-card"
                    )}
                >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={cn(
                        "h-10 w-10 rounded-lg flex items-center justify-center transition-colors",
                        drill.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
                    )}>
                        {drill.status === 'COMPLETED' ? <CheckCircle2 className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                    </div>
                    {drill.status === 'COMPLETED' ? (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            Completed <CheckCircle2 className="w-3 h-3" />
                        </span>
                    ) : (
                        <span className="text-xs font-medium bg-muted px-2 py-1 rounded text-muted-foreground">Optional</span>
                    )}
                    </div>
                    
                    <h3 className="font-bold mb-1 group-hover:text-primary transition-colors relative z-10">{drill.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 relative z-10">{drill.description}</p>
                    
                    {/* Hover Interaction for Active Drills */}
                    {drill.status !== 'COMPLETED' && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-muted">
                            <div className="h-full bg-blue-500 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                        </div>
                    )}
                </div>
            ))}
            </div>
        )}
      </section>
    </div>
  );
}