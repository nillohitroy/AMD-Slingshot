"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Fingerprint, 
  Crosshair, 
  Lock, 
  UserCheck, 
  RefreshCw, 
  Loader2, 
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Data Shape
interface IdentityData {
  identity_score: number;
  institution_domain: string;
  guardian_events: any[];
  simulation: {
    name: string;
    emails_sent: number;
    click_rate: number;
    report_rate: number;
    days_left: number;
  };
  // Added Dynamic Department Stats
  department_stats: Array<{
    dept: string;
    rate: number;
  }>;
}

export default function IdentityDrillPage() {
  const [data, setData] = useState<IdentityData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/identity/");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to color-code vulnerability rates
  const getRateColor = (rate: number) => {
      if (rate >= 50) return "bg-red-500";   // Critical Vulnerability
      if (rate >= 20) return "bg-amber-500"; // Moderate Vulnerability
      return "bg-emerald-500";               // Low Vulnerability
  };

  if (loading && !data) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-8 fade-in-up pb-10">
      
      {/* SECTION 1: Identity Radar (Guardian) */}
      <section>
         <div className="flex items-end justify-between mb-6">
            <div>
               <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Fingerprint className="w-6 h-6 text-emerald-500" /> Identity Radar
               </h2>
               <p className="text-muted-foreground">Dark web exposure and credential integrity monitoring.</p>
            </div>
            <button 
               onClick={fetchData} 
               className="text-sm flex items-center gap-2 text-primary hover:underline"
            >
               <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} /> Scan Now
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Health Card */}
            <div className="col-span-1 bg-gradient-to-br from-emerald-500/10 to-background border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-4 right-4">
                  <UserCheck className="w-8 h-8 text-emerald-500 opacity-50" />
               </div>
               <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-2">Identity Score</div>
               <div className="text-4xl font-mono font-bold">{data.identity_score}/100</div>
               <p className="text-xs text-muted-foreground mt-4">
                  Your domain <span className="font-mono bg-background px-1 rounded">@{data.institution_domain}</span> is {data.identity_score > 80 ? "secure" : "at risk"}.
               </p>
            </div>

            {/* Breach Monitor (Dynamic Guardian Events) */}
            <div className="col-span-2 bg-background border border-border rounded-xl p-6">
               <h3 className="font-semibold text-sm mb-4">Dark Web Hits (Last 30 Days)</h3>
               <div className="space-y-4">
                  {data.guardian_events.length === 0 ? (
                     <div className="flex items-center justify-center p-8 border border-dashed border-border rounded-lg text-sm text-muted-foreground gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No identity leaks detected.
                     </div>
                  ) : (
                     data.guardian_events.map((event: any) => (
                        <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                           <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center">
                                 <Lock className="w-4 h-4 text-red-500" />
                              </div>
                              <div>
                                 <div className="text-sm font-medium">{event.threat_signature}</div>
                                 <div className="text-xs text-muted-foreground">Target: {event.target_url}</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-xs font-mono text-muted-foreground">{event.time_ago}</div>
                              {event.is_resolved && <span className="text-[10px] text-emerald-500 font-bold">RESOLVED</span>}
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      </section>

      {/* SECTION 2: Drill Master (Simulations) */}
      <section className="pt-8 border-t border-border">
         <div className="flex items-end justify-between mb-6">
            <div>
               <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Crosshair className="w-6 h-6 text-amber-500" /> Drill Master
               </h2>
               <p className="text-muted-foreground">Phishing simulations statistics.</p>
            </div>
            <button className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
               Launch New Campaign
            </button>
         </div>

         <div className="bg-background border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
               
               {/* Stat 1: Active Campaign */}
               <div className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Active Campaign</div>
                  <div className="font-bold text-lg truncate px-2">{data.simulation.name}</div>
                  <div className="text-xs text-amber-500 font-medium mt-2">
                     {data.simulation.name === "No Active Campaign" ? "---" : `Ends in ${data.simulation.days_left} days`}
                  </div>
               </div>

               {/* Stat 2: Emails Sent */}
               <div className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Targets (Students)</div>
                  <div className="font-mono text-3xl font-bold">{data.simulation.emails_sent}</div>
               </div>

               {/* Stat 3: Click Rate (Failure) */}
               <div className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Click Rate (Fail)</div>
                  <div className="font-mono text-3xl font-bold text-red-500">{data.simulation.click_rate}%</div>
                  <div className="text-xs text-muted-foreground">Incomplete drills</div>
               </div>

               {/* Stat 4: Report Rate (Success) */}
               <div className="p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-1">Report Rate (Pass)</div>
                  <div className="font-mono text-3xl font-bold text-emerald-500">{data.simulation.report_rate}%</div>
                  <div className="text-xs text-muted-foreground">Completed drills</div>
               </div>
            </div>

            {/* Dynamic Vulnerable Departments */}
            <div className="p-6 bg-muted/10 border-t border-border">
               <h3 className="text-sm font-semibold mb-4">Vulnerable Departments (High Failure Rate)</h3>
               <div className="space-y-3">
                  {!data.department_stats || data.department_stats.length === 0 ? (
                     <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                        <AlertTriangle className="w-4 h-4 opacity-50" />
                        No department data available. (Assign departments to students to enable breakdown)
                     </div>
                  ) : (
                     data.department_stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-4">
                           {/* Department Name */}
                           <div className="w-32 text-sm font-medium text-muted-foreground truncate" title={stat.dept}>
                              {stat.dept}
                           </div>
                           
                           {/* Progress Bar */}
                           <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                 className={cn("h-full transition-all duration-500", getRateColor(stat.rate))} 
                                 style={{ width: `${Math.min(stat.rate, 100)}%` }} 
                              />
                           </div>
                           
                           {/* Rate Value */}
                           <div className="w-12 text-right text-xs font-mono">{stat.rate}%</div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}