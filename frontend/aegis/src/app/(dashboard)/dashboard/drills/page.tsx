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
  CheckCircle2,
  X,
  Trash2,
  Edit,
  Save,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface Choice {
  id?: number;
  text: string;
  is_correct: boolean;
  explanation: string;
}

interface Question {
  id?: number;
  text: string;
  points: number;
  choices: Choice[];
}

interface Campaign {
  id: number;
  title: string;
  status: "RUNNING" | "PAUSED" | "COMPLETED";
  sent: number;     // Target (Students in Domain)
  clicked: number;  // Failed/Not Attempted
  reported: number; // Passed
  questions?: Question[]; // For editing
}

export default function DrillsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCampaignTopic, setNewCampaignTopic] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Edit Modal State
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // --- 1. Fetching Data ---
  const fetchCampaigns = async () => {
    try {
      const res = await api.get("/admin/campaigns/");
      const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
      setCampaigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // --- 2. Create Logic ---
  const handleCreateCampaign = async (topicOverride?: string) => {
    const topic = topicOverride || newCampaignTopic;
    if (!topic) return;

    setIsCreating(true);
    try {
        await api.post("/admin/campaigns/create/", {
            topic: topic,
            difficulty: "Medium"
        });
        setIsCreateOpen(false);
        setNewCampaignTopic("");
        await fetchCampaigns();
    } catch (err) {
        alert("Failed to create. Check console.");
    } finally {
        setIsCreating(false);
    }
  };

  // --- 3. Delete Logic ---
  const handleDelete = async (id: number) => {
    if(!confirm("Are you sure you want to delete this campaign? This cannot be undone.")) return;
    try {
        await api.delete(`/admin/campaigns/${id}/delete/`);
        // Optimistic update
        setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
        alert("Failed to delete.");
    }
  };

  // --- 4. Edit Logic (Opening Modal) ---
  const openEditModal = (campaign: Campaign) => {
    // In a real app, you might fetch full details here if 'questions' aren't in the list view
    setEditingCampaign(JSON.parse(JSON.stringify(campaign))); // Deep copy
    setIsEditOpen(true);
  };

  // --- Helper: Status Colors ---
  const getStatusColor = (status: string) => {
    switch(status) {
      case "RUNNING": return "border-green-500/30 text-green-500 bg-green-500/5";
      case "PAUSED": return "border-amber-500/30 text-amber-500 bg-amber-500/5";
      case "COMPLETED": return "border-muted text-muted-foreground bg-muted/20";
      default: return "border-border text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-8 fade-in-up pb-10 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold flex items-center gap-2">
             <Crosshair className="w-6 h-6 text-amber-500" /> Drill & Simulation
           </h2>
           <p className="text-muted-foreground">Manage AI-generated social engineering tests.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setIsCreateOpen(true)}
             className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
           >
              <Plus className="w-4 h-4" /> New Campaign
           </button>
        </div>
      </div>

      {/* Active Campaigns Table */}
      <div className="border border-border rounded-xl bg-background overflow-hidden min-h-[300px]">
         <div className="bg-muted/30 px-6 py-4 border-b border-border flex justify-between">
            <h3 className="font-semibold text-sm">Active Campaigns</h3>
            <span className="text-xs text-muted-foreground">Live Data</span>
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
                            <span className="flex items-center gap-1 text-red-400"><MailWarning className="w-3 h-3" /> {campaign.clicked} Failed/Pending</span>
                            <span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="w-3 h-3" /> {campaign.reported} Passed</span>
                         </div>
                      </div>

                      {/* Middle: Stats Bar */}
                      <div className="flex-1 flex flex-col gap-2 max-w-sm">
                         <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Completion Rate</span>
                            <span className="font-mono font-bold">
                               {campaign.sent > 0 ? Math.round((campaign.reported / campaign.sent) * 100) : 0}%
                            </span>
                         </div>
                         <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                               className="h-full bg-emerald-500 transition-all duration-1000" 
                               style={{ width: `${campaign.sent > 0 ? (campaign.reported / campaign.sent) * 100 : 0}%` }} 
                            />
                         </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => openEditModal(campaign)}
                            className="p-2 border border-border rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" 
                            title="Edit Questions"
                         >
                            <Edit className="w-4 h-4" />
                         </button>
                         <button 
                            onClick={() => handleDelete(campaign.id)}
                            className="p-2 border border-border rounded hover:bg-red-500/10 hover:border-red-500/50 transition-colors text-muted-foreground hover:text-red-500" 
                            title="Delete Campaign"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))}
            </div>
         )}
      </div>

      {/* --- CREATE CAMPAIGN MODAL (Existing) --- */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background border border-border rounded-xl w-full max-w-md shadow-2xl">
                <div className="p-4 border-b border-border flex justify-between">
                    <h3 className="font-bold">Launch New Campaign</h3>
                    <button onClick={() => setIsCreateOpen(false)}><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 rounded-md border border-border bg-background"
                        placeholder="e.g. Password Expiry Phishing"
                        value={newCampaignTopic}
                        onChange={(e) => setNewCampaignTopic(e.target.value)}
                    />
                    <button 
                        onClick={() => handleCreateCampaign()}
                        disabled={isCreating}
                        className="w-full py-2 rounded-md bg-primary text-primary-foreground font-bold flex justify-center items-center gap-2"
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} Generate & Launch
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- EDIT QUESTIONS MODAL (New) --- */}
      {isEditOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background border border-border rounded-xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                    <div>
                        <h3 className="font-bold">Edit Campaign Content</h3>
                        <p className="text-xs text-muted-foreground">{editingCampaign.title}</p>
                    </div>
                    <button onClick={() => setIsEditOpen(false)}><X className="w-5 h-5" /></button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {editingCampaign.questions?.map((q, qIdx) => (
                        <div key={qIdx} className="border border-border rounded-lg p-4 bg-card relative group">
                            <div className="flex gap-4 mb-4">
                                <span className="font-mono text-sm text-muted-foreground pt-2">Q{qIdx + 1}</span>
                                <textarea 
                                    className="flex-1 bg-transparent border-none resize-none font-medium focus:ring-0"
                                    defaultValue={q.text}
                                    rows={2}
                                />
                            </div>
                            
                            <div className="space-y-2 pl-8">
                                {q.choices.map((c, cIdx) => (
                                    <div key={cIdx} className="flex items-center gap-2 text-sm">
                                        <div className={cn("w-3 h-3 rounded-full border", c.is_correct ? "bg-green-500 border-green-500" : "border-muted-foreground")} />
                                        <input 
                                            type="text" 
                                            defaultValue={c.text}
                                            className="flex-1 bg-transparent border-b border-transparent focus:border-primary outline-none"
                                        />
                                        {c.is_correct && <span className="text-[10px] text-green-500 font-bold uppercase">Correct Answer</span>}
                                    </div>
                                ))}
                            </div>

                            <button className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    
                    <button className="w-full py-3 border-2 border-dashed border-border rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Question
                    </button>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border flex justify-end gap-2 bg-muted/20">
                    <button onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm hover:underline">Cancel</button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}