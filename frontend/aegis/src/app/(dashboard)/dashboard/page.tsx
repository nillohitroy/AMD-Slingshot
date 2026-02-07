"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Radar, 
  BrainCircuit, 
  Fingerprint, 
  Crosshair, 
  Activity, 
  ArrowUpRight,
  MoreHorizontal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the expected data shape from /api/admin/dashboard/
interface DashboardData {
  campus_avg_score: number;
  total_students: number;
  active_threats: number;
  resolved_threats: number;
  at_risk_students: any[];
  recent_logs: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/dashboard/");
        setData(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Optional: Poll every 30 seconds for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center flex-col gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Establishing secure connection...</p>
      </div>
    );
  }

  if (!data) return null;

  // Derive System Status based on Active Threats
  const systemStatus = data.active_threats > 0 ? "Alert" : "Nominal";
  const defconLevel = data.active_threats > 5 ? "DEFCON_3" : data.active_threats > 0 ? "DEFCON_4" : "DEFCON_5";

  return (
    <div className="flex flex-col gap-8 fade-in-up pb-10">
      
      {/* 1. Mission Control Header */}
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Center</h1>
            <div className="text-muted-foreground mt-1 flex items-center gap-2">
               System Integrity: 
               {systemStatus === "Nominal" ? (
                 <span className="text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Nominal
                 </span>
               ) : (
                 <span className="text-amber-500 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Warning
                 </span>
               )}
               <span className="text-border mx-2">|</span>
               Active Protocol: 
               <span className={cn(
                  "font-mono text-xs border px-2 py-0.5 rounded",
                  defconLevel === "DEFCON_3" ? "text-red-500 border-red-500/20 bg-red-500/5" : "text-primary border-primary/20 bg-primary/5"
               )}>
                  {defconLevel}
               </span>
            </div>
        </div>
        <div className="flex gap-3">
             <button className="h-9 px-4 rounded-md border border-border bg-background hover:bg-muted text-sm font-medium transition-colors">
                Generate Report
             </button>
             <button className="h-9 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors shadow-sm">
                Deploy Countermeasures
             </button>
        </div>
      </div>

      {/* 2. The Agent Status Grid (Dynamic Data) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* SENTRY: Shows Active Threats */}
        <AgentCard 
           name="Sentry" 
           role="Traffic Interceptor"
           icon={Radar}
           color="text-blue-500"
           bg="bg-blue-500/10"
           border="group-hover:border-blue-500/50"
           metric={data.active_threats}
           metricLabel="Active Threats"
           status={data.active_threats > 0 ? "Engaging" : "Scanning"}
        />

        {/* ANALYST: Shows Resolved Threats */}
        <AgentCard 
           name="Analyst" 
           role="Cognitive Engine"
           icon={BrainCircuit}
           color="text-purple-500"
           bg="bg-purple-500/10"
           border="group-hover:border-purple-500/50"
           metric={data.resolved_threats}
           metricLabel="Interventions"
           status="Processing NLP"
        />

        {/* GUARDIAN: Shows At-Risk Students (Identity) */}
        <AgentCard 
           name="Guardian" 
           role="Identity Vault"
           icon={Fingerprint}
           color="text-emerald-500"
           bg="bg-emerald-500/10"
           border="group-hover:border-emerald-500/50"
           metric={data.at_risk_students.length}
           metricLabel="At-Risk Identities"
           status="Monitoring Dark Web"
        />

        {/* DRILL: Shows Campus Average Score */}
        <AgentCard 
           name="Drill Master" 
           role="Simulations"
           icon={Crosshair}
           color="text-amber-500"
           bg="bg-amber-500/10"
           border="group-hover:border-amber-500/50"
           metric={`${Math.round(data.campus_avg_score)}%`}
           metricLabel="Campus Resilience"
           status="Campaign Idle"
        />
      </div>

      {/* 3. Live Intervention Feed & Threat Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        
        {/* Left: Live Threat Stream */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-background flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">Live Intervention Feed</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-xs text-muted-foreground font-mono">LIVE_WEBSOCKET</span>
                </div>
            </div>
            
            {/* Real Data Feed */}
            <div className="flex-1 p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-border">
                {data.recent_logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 mb-2 opacity-20" />
                        <p>No recent threats detected.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground bg-muted/30 font-medium border-b border-border sticky top-0 backdrop-blur-sm">
                            <tr>
                                <th className="px-6 py-3">Time</th>
                                <th className="px-6 py-3">Agent</th>
                                <th className="px-6 py-3">Signature</th>
                                <th className="px-6 py-3">Target</th>
                                <th className="px-6 py-3">Risk Lvl</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.recent_logs.map((log: any) => (
                                <tr key={log.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                                        {log.time_ago}
                                    </td>
                                    <td className="px-6 py-3 font-medium flex items-center gap-2">
                                        <span className={cn("w-1.5 h-1.5 rounded-full", 
                                            log.agent === "SENTRY" ? "bg-blue-500" :
                                            log.agent === "ANALYST" ? "bg-purple-500" :
                                            log.agent === "GUARDIAN" ? "bg-emerald-500" : "bg-gray-500"
                                        )} />
                                        {log.agent}
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs truncate max-w-[150px]">
                                        {log.threat_signature}
                                    </td>
                                    <td className="px-6 py-3 text-muted-foreground truncate max-w-[200px]" title={log.target_url}>
                                        {log.target_url}
                                    </td>
                                    <td className="px-6 py-3 font-mono text-xs">
                                        <span className={cn("px-2 py-0.5 rounded border", 
                                            log.severity >= 3 ? "border-red-500/30 bg-red-500/10 text-red-500" : 
                                            log.severity === 2 ? "border-amber-500/30 bg-amber-500/10 text-amber-500" :
                                            "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                        )}>
                                            {log.severity >= 3 ? "CRIT" : log.severity === 2 ? "HIGH" : "LOW"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

        {/* Right: Quick Actions / System Health */}
        <div className="flex flex-col gap-6">
            
            {/* Quick Actions Panel */}
            <div className="rounded-xl border border-border bg-background p-6 flex flex-col h-1/2">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Immediate Protocols
                </h3>
                <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-between group">
                        <span className="text-sm font-medium">Purge Cache & Rescan</span>
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-between group">
                        <span className="text-sm font-medium">Initiate Phishing Drill</span>
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-between group">
                        <span className="text-sm font-medium">Export Compliance Log</span>
                        <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* System Load (Simulated for Visuals) */}
            <div className="rounded-xl border border-border bg-background p-6 flex flex-col h-1/2 relative overflow-hidden">
                <h3 className="font-semibold text-sm mb-2 z-10">Network Load</h3>
                {/* Dynamic Logic: Higher active threats = Higher load */}
                <div className="text-3xl font-mono font-bold z-10">
                   {data.active_threats > 5 ? "87%" : data.active_threats > 0 ? "42%" : "12%"}
                </div>
                <p className="text-xs text-muted-foreground z-10">
                   Peak latency: {data.active_threats > 5 ? "142ms" : "12ms"}
                </p>

                {/* Decorative Graph Line */}
                <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
                     <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 L0 50 L10 60 L20 40 L30 70 L40 30 L50 60 L60 20 L70 50 L80 40 L90 60 L100 50 L100 100 Z" fill="currentColor" className={data.active_threats > 0 ? "text-amber-500" : "text-primary"} />
                     </svg>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

// Helper Component for the Grid (Unchanged in logic, just receives dynamic props)
function AgentCard({ name, role, icon: Icon, color, bg, border, metric, metricLabel, status }: any) {
    return (
        <div className={cn("group relative overflow-hidden rounded-xl border border-border bg-background p-6 transition-all hover:shadow-md", border)}>
            <div className="flex justify-between items-start mb-4">
                <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center transition-colors", bg)}>
                    <Icon className={cn("h-5 w-5", color)} />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-border bg-muted/30">
                    <span className="relative flex h-2 w-2">
                      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", color.replace("text-", "bg-"))}></span>
                      <span className={cn("relative inline-flex rounded-full h-2 w-2", color.replace("text-", "bg-"))}></span>
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{status}</span>
                </div>
            </div>
            
            <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{name}</h3>
                <p className="text-xs text-muted-foreground">{role}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-end justify-between">
                <div>
                    <div className="text-2xl font-mono font-bold text-foreground">{metric}</div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold mt-0.5">{metricLabel}</div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-muted rounded-md text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}