"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Radar, Shield, Globe, Zap, AlertTriangle, Radio, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the Data Shape
interface LogEntry {
  id: number;
  threat_signature: string;
  target_url: string;
  severity: number;
  agent: string;
  time_ago: string;
  is_resolved: boolean;
}

export default function SentinelPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/admin/sentinel/");
      // Handle potential pagination vs flat array
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setLogs(data);
      setIsConnected(true);
    } catch (err) {
      console.error("Sentinel stream error:", err);
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Poll every 3 seconds for "Real Time" feel
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)] fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
           <h2 className="text-2xl font-bold flex items-center gap-2">
             <Radar className="w-6 h-6 text-blue-500" /> Live Sentinel
           </h2>
           <p className="text-muted-foreground">Real-time edge traffic analysis and interception.</p>
        </div>
        <div className="flex items-center gap-4 bg-background border border-border px-4 py-2 rounded-lg">
           <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    isConnected ? "bg-emerald-400" : "bg-red-400"
                )}></span>
                <span className={cn(
                    "relative inline-flex rounded-full h-3 w-3",
                    isConnected ? "bg-emerald-500" : "bg-red-500"
                )}></span>
              </span>
              <span className="font-mono text-sm font-bold">
                  {isConnected ? "NET_DEFENSE: ACTIVE" : "CONNECTION_LOST"}
              </span>
           </div>
           <div className="h-4 w-px bg-border" />
           <span className="font-mono text-xs text-muted-foreground">LATENCY: {isConnected ? "12ms" : "---"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
         
         {/* LEFT: The Cyber Map (Visual Only) */}
         <div className="lg:col-span-2 bg-black/90 rounded-xl border border-border relative overflow-hidden flex items-center justify-center p-8 group">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />
            
            {/* World Map SVG Abstract */}
            <div className="relative w-full h-full opacity-40">
               {/* Randomized "Traffic" Dots */}
               {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
                    transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 5 }}
                    className="absolute rounded-full bg-blue-500 blur-sm"
                    style={{
                       top: `${Math.random() * 80 + 10}%`,
                       left: `${Math.random() * 80 + 10}%`,
                       width: '4px',
                       height: '4px'
                    }}
                  />
               ))}
               
               {/* Central Hub */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-32 h-32 border border-blue-500/30 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                      <div className="w-24 h-24 border border-dashed border-blue-500/50 rounded-full" />
                   </div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-blue-500" />
                   </div>
               </div>
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-6 left-6 font-mono text-xs text-blue-400 space-y-1">
               <div>NODES_ONLINE: {isConnected ? "14/14" : "0/14"}</div>
               <div>PACKET_LOSS: 0.002%</div>
               <div>EVENTS_CAPTURED: {logs.length}</div>
            </div>
         </div>

         {/* RIGHT: Threat Stream (Dynamic) */}
         <div className="bg-background border border-border rounded-xl flex flex-col min-h-0">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
               <h3 className="font-semibold text-sm">Interception Log</h3>
               <Radio className="w-4 h-4 text-muted-foreground animate-pulse" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
               {loading && logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
                      <Loader2 className="animate-spin w-4 h-4" /> Syncing...
                  </div>
               ) : logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4 text-center">
                      <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm">No active threats intercepted.</p>
                      <p className="text-xs opacity-50">System is scanning.</p>
                  </div>
               ) : (
                  logs.map((log) => (
                    <div key={log.id} className="p-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3 text-sm group">
                        {/* Icon based on Severity */}
                        <div className="mt-1 shrink-0">
                           {log.severity >= 3 ? (
                               <Zap className="w-4 h-4 text-red-500 fill-red-500/10" />
                           ) : log.severity === 2 ? (
                               <AlertTriangle className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                           ) : (
                               <Globe className="w-4 h-4 text-blue-500" />
                           )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                           <div className="flex items-center justify-between gap-2">
                              <span className={cn(
                                  "font-mono text-xs font-bold truncate",
                                  log.severity >= 3 ? "text-red-500" : "text-foreground"
                              )}>
                                 {log.threat_signature.toUpperCase()}
                              </span>
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                                  {log.time_ago}
                              </span>
                           </div>
                           <div className="text-muted-foreground text-xs mt-0.5 truncate font-mono" title={log.target_url}>
                              target: {log.target_url}
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