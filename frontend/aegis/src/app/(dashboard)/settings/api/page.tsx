"use client";

import { useState } from "react";
import { 
  Copy, 
  RefreshCw, 
  Plus, 
  CheckCircle2, 
  Webhook, 
  AlertCircle, 
  Check, 
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ApiSettingsPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("pk_live_51Mxq...92x");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 fade-in-up">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold">API & Integrations</h2>
        <p className="text-sm text-muted-foreground">Manage API keys, webhooks, and third-party connections.</p>
      </div>

      {/* 1. API Keys Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Server className="w-4 h-4" /> Production Keys
           </h3>
           <button className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
              <Plus className="w-3 h-3" /> Generate New Key
           </button>
        </div>
        
        <div className="bg-background border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-bold bg-muted/50 px-2 py-1 rounded text-foreground">
                        pk_live_51Mxq...92x
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-500/20 flex items-center gap-1">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                        </span>
                        Active
                    </span>
                </div>
                <div className="text-xs text-muted-foreground pl-1">Created on Oct 24, 2025 • Last used 2 mins ago</div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={handleCopy}
                    className="p-2 hover:bg-muted rounded-md border border-border text-muted-foreground transition-all active:scale-95" 
                    title="Copy Key"
                >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button className="px-3 py-2 hover:bg-muted rounded-md border border-border text-xs font-medium flex items-center gap-2 text-foreground transition-colors">
                    <RefreshCw className="w-3 h-3" /> Roll Key
                </button>
            </div>
        </div>
      </section>

      {/* 2. Integrations Grid */}
      <section className="space-y-4 pt-4">
         <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Installed Integrations</h3>
         
         <div className="grid md:grid-cols-2 gap-4">
            
            {/* Canvas LMS - Connected */}
            <div className="border border-border rounded-xl p-5 bg-background flex items-start gap-4 hover:border-primary/30 transition-colors group">
                <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0 border border-red-500/20">
                    <span className="font-bold text-red-600 text-sm">Cn</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">Canvas LMS</h4>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Synced
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">Syncs course rosters and gradebook data for simulation assignments.</p>
                    <div className="flex gap-2">
                        <button className="text-xs border border-border px-3 py-1.5 rounded-md hover:bg-muted font-medium transition-colors">Configure</button>
                        <button className="text-xs text-muted-foreground hover:text-red-500 px-2 py-1.5 transition-colors">Disconnect</button>
                    </div>
                </div>
            </div>

            {/* Microsoft Entra - Connected */}
            <div className="border border-border rounded-xl p-5 bg-background flex items-start gap-4 hover:border-primary/30 transition-colors group">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0 border border-blue-500/20">
                     <span className="font-bold text-blue-600 text-sm">Az</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">Microsoft Entra ID</h4>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> SSO Active
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">Handles Single Sign-On (SSO) and directory syncing for students.</p>
                    <div className="flex gap-2">
                        <button className="text-xs border border-border px-3 py-1.5 rounded-md hover:bg-muted font-medium transition-colors">Configure</button>
                    </div>
                </div>
            </div>

            {/* Slack - Not Connected */}
            <div className="border border-border rounded-xl p-5 bg-background flex items-start gap-4 opacity-80 hover:opacity-100 transition-opacity">
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0 border border-purple-500/20">
                     <span className="font-bold text-purple-600 text-sm">Sl</span>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">Slack Enterprise</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">Send immediate threat alerts to your #security-ops channel.</p>
                    <button className="text-xs bg-foreground text-background px-3 py-1.5 rounded-md hover:opacity-90 font-medium transition-opacity">
                        Connect Workspace
                    </button>
                </div>
            </div>
         </div>
      </section>

      {/* 3. Webhooks */}
      <section className="space-y-4 pt-4">
         <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Webhook className="w-4 h-4" /> Webhooks
            </h3>
         </div>
         
         <div className="border border-border rounded-xl overflow-hidden bg-background">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-semibold border-b border-border">
                    <tr>
                        <th className="px-6 py-3">Endpoint URL</th>
                        <th className="px-6 py-3">Events</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs">https://api.university.edu/webhooks/aegis</td>
                        <td className="px-6 py-4">
                            <span className="bg-muted px-2 py-0.5 rounded text-xs border border-border">threat.detected</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className="text-emerald-500 text-xs font-medium flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Live
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-xs text-primary hover:underline">Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            {/* Add New Empty State Row */}
            <div className="p-3 bg-muted/10 border-t border-border flex justify-center">
                <button className="text-xs border border-dashed border-border px-4 py-2 rounded-md hover:border-primary/50 hover:text-primary transition-colors flex items-center gap-2 text-muted-foreground">
                    <Plus className="w-3 h-3" /> Add Endpoint
                </button>
            </div>
         </div>
      </section>
    </div>
  );
}