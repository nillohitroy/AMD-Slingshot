"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Crosshair, 
  Plus, 
  Play, 
  Pause, 
  BarChart3, 
  Users, 
  MailWarning, 
  Wand2, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define Data Shape
interface Campaign {
  id: number;
  title: string;
  status: "RUNNING" | "PAUSED" | "COMPLETED";
  sent: number;     // Total Students
  clicked: number;  // Failed
  reported: number; // Success
}

export default function DrillsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await api.get("/admin/campaigns/");
        // Handle pagination if backend sends it
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setCampaigns(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // Helper for Status Colors
  const getStatusColor = (status: string) => {
    switch(status) {
      case "RUNNING": return "border-green-500/30 text-green-500 bg-green-500/5";
      case "PAUSED": return "border-amber-500/30 text-amber-500 bg-amber-500/5";
      case "COMPLETED": return "border-muted text-muted-foreground bg-muted/20";
      default: return "border-border text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-8 fade-in-up pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold flex items-center gap-2">
             <Crosshair className="w-6 h-6 text-amber-500" /> Drill & Simulation
           </h2>
           <p className="text-muted-foreground">Manage AI-generated social engineering tests.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 border border-border bg-background rounded-md text-sm font-medium hover:bg-muted transition-colors">
              <BarChart3 className="w-4 h-4" /> Reports
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> New Campaign
           </button>
        </div>
      </div>

      {/* AI Generator Banner (Static UI / Mock Functionality) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-background to-background border border-amber-500/20 rounded-xl p-6 flex items-start gap-4">
         <div className="p-3 bg-amber-500/10 rounded-lg shrink-0">
            <Wand2 className="w-6 h-6 text-amber-500" />
         </div>
         <div className="space-y-2">
            <h3 className="font-semibold text-lg">AI Scenario Generator</h3>
            <p className="text-muted-foreground text-sm max-w-2xl">
               Agent Drill has analyzed recent campus news. It suggests a simulation based on the 
               <span className="font-medium text-foreground"> "New Library Access Policy" </span> 
               sent yesterday. This topic has high relevance and click-probability.
            </p>
            <div className="pt-2">
               <button className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded font-medium hover:bg-amber-600 transition-colors">
                  Preview & Launch Scenario
               </button>
            </div>
         </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="border border-border rounded-xl bg-background overflow-hidden min-h-[300px]">
         <div className="bg-muted/30 px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-sm">Campaigns</h3>
         </div>
         
         {loading ? (
             <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                 <Loader2 className="animate-spin w-6 h-6" /> Loading Campaigns...
             </div>
         ) : campaigns.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
                 <Crosshair className="w-8 h-8 opacity-20" />
                 <p>No campaigns active.</p>
             </div>
         ) : (
            <div className="divide-y divide-border">
                {campaigns.map((campaign) => (
                   <div key={campaign.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-muted/20 transition-colors group">
                      
                      {/* Left: Info */}
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-1">
                            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", getStatusColor(campaign.status))}>
                               {campaign.status}
                            </span>
                            <h4 className="font-medium text-lg">{campaign.title}</h4>
                         </div>
                         <div className="text-xs text-muted-foreground flex gap-4 mt-2">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {campaign.sent} Targets</span>
                            <span className="flex items-center gap-1 text-red-400"><MailWarning className="w-3 h-3" /> {campaign.clicked} Failed</span>
                            <span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="w-3 h-3" /> {campaign.reported} Passed</span>
                         </div>
                      </div>

                      {/* Middle: Stats Bar */}
                      <div className="flex-1 flex flex-col gap-2 max-w-sm">
                         <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Resilience Score</span>
                            <span className="font-mono font-bold">
                               {campaign.sent > 0 ? Math.round((campaign.reported / campaign.sent) * 100) : 0}%
                            </span>
                         </div>
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                               className={cn("h-full transition-all duration-1000", campaign.status === 'COMPLETED' ? "bg-muted-foreground" : "bg-primary")} 
                               style={{ width: `${campaign.sent > 0 ? (campaign.reported / campaign.sent) * 100 : 0}%` }} 
                            />
                         </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex gap-2">
                         {campaign.status === "RUNNING" ? (
                            <button className="p-2 border border-border rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Pause">
                               <Pause className="w-4 h-4" />
                            </button>
                         ) : (
                            <button className="p-2 border border-border rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Resume/Start">
                               <Play className="w-4 h-4" />
                            </button>
                         )}
                      </div>
                   </div>
                ))}
            </div>
         )}
      </div>
    </div>
  );
}