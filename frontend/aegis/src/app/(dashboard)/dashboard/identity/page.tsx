"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Globe, 
  Lock, 
  Wand2,
  Loader2,
  X,
  AlertTriangle,
  Zap,
  TrendingUp
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from "@/lib/utils";

// Types
interface DeptStat {
  name: string;
  score: number;
  students: number;
}

interface IdentityData {
  identity_score: number;
  dark_web_hits: number;
  monitored_users: number;
  department_stats: DeptStat[];
  recent_breaches: any[];
}

export default function IdentityPage() {
  const [data, setData] = useState<IdentityData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // --- Scan State ---
  const [isScanning, setIsScanning] = useState(false);

  // --- Campaign Modal State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaignTopic, setNewCampaignTopic] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    try {
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

  // --- Scan Logic (New) ---
  const handleScan = async () => {
    setIsScanning(true);
    try {
        const res = await api.post("/admin/identity/scan/");
        alert(`Scan Complete. Found ${res.data.new_breaches_found} new leaks.`);
        // Refresh data to show new hits immediately
        await fetchData();
    } catch (err) {
        alert("Scan failed. Please check backend logs.");
    } finally {
        setIsScanning(false);
    }
  };

  // --- Campaign Logic ---
  const handleCreateCampaign = async () => {
    if (!newCampaignTopic) return;
    setIsCreating(true);
    try {
        await api.post("/admin/campaigns/create/", {
            topic: newCampaignTopic,
            difficulty: "Medium"
        });
        alert("Simulation Launched Successfully");
        setIsModalOpen(false);
        setNewCampaignTopic("");
    } catch (err) {
        alert("Failed to launch campaign.");
    } finally {
        setIsCreating(false);
    }
  };

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>;
  if (!data) return null;

  // Color logic for the Identity Score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6 fade-in-up pb-10">
      
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         
         {/* Identity Score Card */}
         <div className="bg-background border border-border p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  <Activity className="w-5 h-5" />
               </div>
               <span className={cn("text-xs font-bold px-2 py-1 rounded-full bg-muted", getScoreColor(data.identity_score))}>
                  LIVE
               </span>
            </div>
            <div className="mt-4">
               <div className={cn("text-4xl font-bold", getScoreColor(data.identity_score))}>
                  {data.identity_score}
               </div>
               <div className="text-sm text-muted-foreground mt-1">Identity Health Score</div>
            </div>
         </div>

         {/* Dark Web Hits Card (Now Interactive) */}
         <div className="bg-background border border-border p-6 rounded-xl flex flex-col justify-between group hover:border-red-500/50 transition-colors relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
               <div className="h-10 w-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                  <Globe className={cn("w-5 h-5", isScanning && "animate-spin")} />
               </div>
               
               {/* Scan Button */}
               <button 
                 onClick={handleScan}
                 disabled={isScanning}
                 className="flex items-center gap-1 text-[10px] font-bold bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
               >
                  {isScanning ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Scanning...
                      </>
                  ) : (
                      <>
                        <ShieldAlert className="w-3 h-3" /> Scan Now
                      </>
                  )}
               </button>
            </div>

            <div className="mt-4 relative z-10">
               <div className="text-3xl font-bold text-foreground">{data.dark_web_hits}</div>
               <div className="text-sm text-muted-foreground mt-1">Verified Breaches</div>
               {data.dark_web_hits > 0 && (
                   <div className="text-[10px] text-red-500 mt-2 font-medium flex items-center gap-1">
                       <TrendingUp className="w-3 h-3" /> Impact: -{data.dark_web_hits * 5} pts
                   </div>
               )}
            </div>
         </div>

         {/* Monitored Users */}
         <div className="bg-background border border-border p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                  <Users className="w-5 h-5" />
               </div>
            </div>
            <div className="mt-4">
               <div className="text-3xl font-bold text-foreground">{data.monitored_users}</div>
               <div className="text-sm text-muted-foreground mt-1">Monitored Accounts</div>
            </div>
         </div>

         {/* Active Threats */}
         <div className="bg-background border border-border p-6 rounded-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                  <Lock className="w-5 h-5" />
               </div>
            </div>
            <div className="mt-4">
               <div className="text-3xl font-bold text-foreground">0</div>
               <div className="text-sm text-muted-foreground mt-1">Active Breaches</div>
            </div>
         </div>
      </div>

      {/* 2. DRILL MASTER ANALYTICS SECTION */}
      <div className="grid md:grid-cols-3 gap-6">
         
         {/* CHART AREA */}
         <div className="md:col-span-2 bg-background border border-border rounded-xl p-6">
             <div className="flex items-center justify-between mb-6">
                 <div>
                     <h3 className="text-lg font-bold flex items-center gap-2">
                         <Zap className="w-5 h-5 text-amber-500" /> Department Resilience
                     </h3>
                     <p className="text-sm text-muted-foreground">Average Risk Score by Department</p>
                 </div>
                 
                 {/* THE LAUNCH BUTTON */}
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                 >
                     <Wand2 className="w-4 h-4" /> Launch Simulation
                 </button>
             </div>

             <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={data.department_stats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                         <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 12, fill: '#888' }} 
                            dy={10}
                         />
                         <YAxis 
                            hide 
                            domain={[0, 100]}
                         />
                         <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                         />
                         <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                            {data.department_stats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#10b981' : entry.score > 50 ? '#f59e0b' : '#ef4444'} />
                            ))}
                         </Bar>
                     </BarChart>
                 </ResponsiveContainer>
             </div>
         </div>

         {/* RECENT BREACHES FEED */}
         <div className="md:col-span-1 bg-background border border-border rounded-xl p-6 flex flex-col">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <Globe className="w-5 h-5 text-red-500" /> Recent Leaks
             </h3>
             
             <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[300px]">
                 {data.recent_breaches.length === 0 ? (
                     <div className="text-center text-muted-foreground py-10 text-sm">
                         No leaks detected in your domain.
                     </div>
                 ) : (
                     data.recent_breaches.map((breach: any) => (
                         <div key={breach.id} className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                             <div className="mt-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                             <div>
                                 <div className="text-sm font-bold text-foreground">Credential Leak</div>
                                 <div className="text-xs text-muted-foreground">{breach.user__email}</div>
                                 <div className="text-[10px] text-red-400 mt-1 font-mono">
                                     {new Date(breach.timestamp).toLocaleDateString()}
                                 </div>
                             </div>
                         </div>
                     ))
                 )}
             </div>
         </div>
      </div>

      {/* --- CAMPAIGN MODAL (Identical to Drills Page) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background border border-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h3 className="font-bold">Launch AI Simulation</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Simulation Topic</label>
                        <input 
                            autoFocus
                            type="text" 
                            className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-1 focus:ring-primary outline-none"
                            placeholder="e.g. 'Payroll Update' Phishing..."
                            value={newCampaignTopic}
                            onChange={(e) => setNewCampaignTopic(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            This will target the department with the lowest resilience score automatically.
                        </p>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded p-3 text-xs text-amber-600 flex gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <p>This action will generate emails and affect the Identity Score if students fail.</p>
                    </div>
                </div>

                <div className="p-4 bg-muted/20 border-t border-border flex justify-end gap-2">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => handleCreateCampaign()}
                        disabled={!newCampaignTopic || isCreating}
                        className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                        Launch Now
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}