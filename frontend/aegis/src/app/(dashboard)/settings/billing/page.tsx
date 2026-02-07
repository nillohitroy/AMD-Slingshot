"use client";

import { CreditCard, Download, Zap, CheckCircle2 } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold">Billing & Plans</h2>
        <p className="text-sm text-muted-foreground">Manage your subscription and usage limits.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Plan Card */}
         <div className="lg:col-span-2 space-y-6">
            <div className="border border-primary/20 bg-primary/5 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-32 h-32 rotate-[-15deg]" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">Enterprise Education Plan</h3>
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded font-medium border border-primary/20">Active</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6 max-w-md">
                        Full access to Agent Sentry, Drill Master, and Identity Guard.
                    </p>
                    
                    {/* Usage Stats */}
                    <div className="space-y-5 bg-background/60 backdrop-blur-sm p-5 rounded-lg border border-primary/10 shadow-sm">
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="font-medium flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Active Student Seats</span>
                                <span className="font-mono">8,420 / 10,000</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[84%] rounded-full" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className="font-medium flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> API Calls (Monthly)</span>
                                <span className="font-mono">1.2M / 5M</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[24%] rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="border border-border rounded-xl bg-background overflow-hidden">
                <div className="px-6 py-3 border-b border-border bg-muted/30 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    Invoice History
                </div>
                <div className="divide-y divide-border">
                    {[
                        { date: "Oct 01, 2025", amount: "$2,400.00", status: "Paid", ref: "INV-2025-001" },
                        { date: "Sep 01, 2025", amount: "$2,400.00", status: "Paid", ref: "INV-2025-002" },
                        { date: "Aug 01, 2025", amount: "$2,400.00", status: "Paid", ref: "INV-2025-003" },
                    ].map((inv, i) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                            <div>
                                <div className="text-sm font-medium">{inv.date}</div>
                                <div className="text-xs text-muted-foreground">Ref: {inv.ref}</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono font-medium">{inv.amount}</span>
                                <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/20 font-medium">{inv.status}</span>
                                <button className="p-2 hover:bg-muted rounded text-muted-foreground transition-colors" title="Download PDF">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>

         {/* Right Sidebar: Payment Method */}
         <div className="space-y-6">
            <div className="border border-border rounded-xl p-6 bg-background shadow-sm">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="font-semibold text-sm">Payment Method</h3>
                   <button className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/10 mb-4">
                    <div className="h-8 w-12 bg-[#1A1F71] rounded flex items-center justify-center text-white font-bold text-[10px] tracking-widest italic">
                        VISA
                    </div>
                    <div>
                        <div className="text-sm font-medium">•••• 4242</div>
                        <div className="text-xs text-muted-foreground">Expires 12/28</div>
                    </div>
                </div>
                <button className="text-sm border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-muted w-full py-2 rounded-md transition-all">
                    + Add new card
                </button>
            </div>

            <div className="border border-border rounded-xl p-6 bg-background shadow-sm">
                <h3 className="font-semibold text-sm mb-2">Billing Contact</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Invoices are sent to <strong>billing@tech.edu</strong>
                </p>
                <button className="text-xs text-primary hover:underline">
                    Change email
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}