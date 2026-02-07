"use client";

import { Copy, Plus, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function ApiSettingsPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold">API & Integrations</h2>
        <p className="text-sm text-muted-foreground">Manage API keys and external service connections.</p>
      </div>

      {/* API Keys Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Production Keys</h3>
        
        <div className="bg-background border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold">pk_live_51M...92x</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase border border-green-500/20">Active</span>
                </div>
                <div className="text-xs text-muted-foreground">Created on Oct 24, 2024 • Last used 2 mins ago</div>
            </div>
            <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-md border border-border text-muted-foreground" title="Copy Key">
                    <Copy className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 hover:bg-muted rounded-md border border-border text-xs font-medium flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" /> Roll Key
                </button>
            </div>
        </div>

        <button className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
           <Plus className="w-4 h-4" /> Create new secret key
        </button>
      </section>

      {/* Integrations Grid */}
      <section className="space-y-4 pt-4">
         <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Installed Integrations</h3>
         
         <div className="grid md:grid-cols-2 gap-4">
            {/* Integration 1: Canvas */}
            <div className="border border-border rounded-lg p-4 bg-background flex items-start gap-4">
                <div className="h-10 w-10 bg-red-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <div className="font-bold text-red-600 text-xs">C</div> {/* Canvas Logo Placeholder */}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">Canvas LMS</h4>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Syncs course rosters and gradebook data for simulation assignments.</p>
                </div>
            </div>

            {/* Integration 2: Slack */}
            <div className="border border-border rounded-lg p-4 bg-background flex items-start gap-4">
                <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                     <div className="font-bold text-blue-600 text-xs">S</div>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm">Slack Enterprise</h4>
                         <button className="text-xs border border-border px-2 py-1 rounded hover:bg-muted">Connect</button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Send immediate threat alerts to your #security-ops channel.</p>
                </div>
            </div>
         </div>
      </section>

      {/* Webhooks */}
      <section className="space-y-4 pt-4">
         <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Webhooks</h3>
         <div className="bg-muted/20 border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-background rounded-full border border-border mb-3">
                <AlertCircle className="w-6 h-6 text-muted-foreground" />
            </div>
            <h4 className="font-medium text-sm">No Webhooks Configured</h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                Listen for events like `threat.detected` or `drill.completed` on your own servers.
            </p>
            <button className="px-4 py-2 bg-background border border-border rounded-md text-sm font-medium hover:bg-muted">
                Add Endpoint
            </button>
         </div>
      </section>
    </div>
  );
}