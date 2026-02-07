"use client";

import { CreditCard, Check, Download, Zap } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold">Billing & Plans</h2>
        <p className="text-sm text-muted-foreground">Manage your subscription and payment methods.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {/* Plan Details */}
         <div className="lg:col-span-2 space-y-6">
            <div className="border border-primary/20 bg-primary/5 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-24 h-24 rotate-[-15deg]" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">Enterprise Education Plan</h3>
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded font-medium">Active</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-6 max-w-md">
                        Full access to all AI Agents, Unlimited API requests, and Dedicated Support.
                    </p>
                    
                    {/* Usage Stats */}
                    <div className="space-y-4 bg-background/50 p-4 rounded-lg border border-primary/10">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium">Seats (Students)</span>
                                <span>8,420 / 10,000</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[84%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-medium">API Calls</span>
                                <span>1.2M / 5M</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[24%]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices */}
            <div className="border border-border rounded-lg bg-background overflow-hidden">
                <div className="px-6 py-3 border-b border-border bg-muted/30 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    Invoice History
                </div>
                <div className="divide-y divide-border">
                    {[
                        { date: "Oct 1, 2025", amount: "$2,400.00", status: "Paid" },
                        { date: "Sep 1, 2025", amount: "$2,400.00", status: "Paid" },
                        { date: "Aug 1, 2025", amount: "$2,400.00", status: "Paid" },
                    ].map((inv, i) => (
                        <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-muted/20">
                            <div>
                                <div className="text-sm font-medium">{inv.date}</div>
                                <div className="text-xs text-muted-foreground">Enterprise Plan - Monthly</div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-mono">{inv.amount}</span>
                                <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/20">{inv.status}</span>
                                <button className="p-2 hover:bg-muted rounded text-muted-foreground">
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>

         {/* Payment Method Side Panel */}
         <div className="space-y-6">
            <div className="border border-border rounded-xl p-6 bg-background">
                <h3 className="font-semibold text-sm mb-4">Payment Method</h3>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-muted/10 mb-4">
                    <div className="h-8 w-12 bg-foreground rounded flex items-center justify-center text-background font-bold text-xs">
                        VISA
                    </div>
                    <div>
                        <div className="text-sm font-medium">•••• 4242</div>
                        <div className="text-xs text-muted-foreground">Expires 12/28</div>
                    </div>
                </div>
                <button className="text-sm text-primary hover:underline w-full text-left">
                    + Add new card
                </button>
            </div>

            <div className="border border-border rounded-xl p-6 bg-background">
                <h3 className="font-semibold text-sm mb-2">Billing Contact</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Invoices are sent to <strong>billing@tech.edu</strong>
                </p>
                <button className="text-sm border border-border px-3 py-1.5 rounded hover:bg-muted w-full">
                    Edit Details
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}