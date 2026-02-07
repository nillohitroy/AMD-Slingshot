"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Shield, ShieldAlert, ShieldCheck, Globe, Key, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Define the API Data Shape
interface HistoryItem {
  id: number;
  agent: "SENTRY" | "GUARDIAN" | "ANALYST";
  threat_signature: string;
  target_url: string;
  severity: number; // 1 (Low) to 4 (Critical)
  is_resolved: boolean;
  time_ago: string;
}

export default function StudentHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/student/history/");
        // Safety check for array vs pagination object
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  // 3. Helper to determine color based on Severity (1-4)
  const getStatusColor = (severity: number) => {
    if (severity >= 4) return "bg-red-500 ring-red-500/20"; // Critical -> Red
    if (severity === 3) return "bg-amber-500 ring-amber-500/20"; // High -> Amber
    return "bg-emerald-500 ring-emerald-500/20"; // Low/Med -> Green
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold mb-2">Security Activity</h1>
        <p className="text-muted-foreground">A timeline of how Aegis has protected you.</p>
      </div>

      <div className="relative border-l border-border ml-4 space-y-12">
         {history.length === 0 ? (
            <div className="pl-8 text-muted-foreground py-8">
               No security events recorded yet. You are safe!
            </div>
         ) : (
            history.map((event) => (
              <div key={event.id} className="relative pl-8 group">
                 {/* Timeline Dot (Dynamic Color) */}
                 <div className={cn(
                    "absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background ring-4 transition-all",
                    getStatusColor(event.severity)
                 )} />
                 
                 {/* Content Card */}
                 <div className="bg-background border border-border rounded-xl p-6 transition-all hover:shadow-md hover:border-primary/30">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {event.time_ago}
                       </span>
                       
                       {/* Dynamic Icon based on Agent */}
                       <div className={cn(
                          "p-1.5 rounded-lg",
                          event.agent === 'SENTRY' ? 'bg-blue-500/10 text-blue-500' :
                          event.agent === 'GUARDIAN' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-gray-500/10 text-gray-500'
                       )}>
                          {event.agent === 'SENTRY' ? <Globe className="w-4 h-4" /> :
                           event.agent === 'GUARDIAN' ? <Key className="w-4 h-4" /> :
                           <Shield className="w-4 h-4" />
                          }
                       </div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-1 text-foreground">
                        {event.threat_signature}
                    </h3>
                    
                    <div className="text-xs font-mono text-muted-foreground mb-3 bg-muted/50 inline-block px-2 py-1 rounded max-w-full truncate">
                       {event.target_url}
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                       {/* Dynamic Description Logic */}
                       {event.agent === 'SENTRY' && "Intercepted a connection to a potentially malicious domain."}
                       {event.agent === 'GUARDIAN' && "Detected an anomaly in your authentication pattern."}
                       {event.agent === 'ANALYST' && "AI analysis flagged this activity as unusual behavior."}
                       {event.is_resolved && <span className="text-emerald-500 font-medium ml-1">Threat resolved.</span>}
                    </p>
                 </div>
              </div>
            ))
         )}
      </div>
    </div>
  );
}