"use client";

import { Shield, Key, Smartphone, LogOut, Laptop } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="space-y-6 fade-in-up">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold">Security & Access</h2>
        <p className="text-sm text-muted-foreground">Manage your credentials and active sessions.</p>
      </div>

      {/* 1. Change Password */}
      <div className="border border-border rounded-xl bg-background p-6">
        <h3 className="font-semibold text-sm flex items-center gap-2 mb-4">
           <Key className="w-4 h-4 text-primary" /> Password
        </h3>
        <div className="max-w-md space-y-4">
           <div className="space-y-2">
              <label className="text-xs font-medium uppercase text-muted-foreground">Current Password</label>
              <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3" />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-medium uppercase text-muted-foreground">New Password</label>
              <input type="password" className="flex h-10 w-full rounded-md border border-input bg-background px-3" />
           </div>
           <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              Update Password
           </button>
        </div>
      </div>

      {/* 2. Two-Factor Auth */}
      <div className="border border-border rounded-xl bg-background p-6">
        <div className="flex items-start justify-between">
           <div>
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-1">
                 <Smartphone className="w-4 h-4 text-primary" /> Two-Factor Authentication (2FA)
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg">
                 Add an extra layer of security to your account by requiring a verification code from your mobile app.
              </p>
           </div>
           <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded border border-green-500/20 font-medium">Enabled</span>
        </div>
        <div className="mt-4 pt-4 border-t border-border flex gap-4">
           <button className="text-sm border border-border px-3 py-1.5 rounded-md hover:bg-muted transition-colors">
              Reconfigure
           </button>
           <button className="text-sm text-red-500 hover:underline">
              Disable 2FA
           </button>
        </div>
      </div>

      {/* 3. Active Sessions */}
      <div className="border border-border rounded-xl bg-background overflow-hidden">
        <div className="px-6 py-3 border-b border-border bg-muted/30">
           <h3 className="font-semibold text-sm">Active Sessions</h3>
        </div>
        <div className="divide-y divide-border">
           {/* Current Session */}
           <div className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                    <Laptop className="w-5 h-5 text-foreground" />
                 </div>
                 <div>
                    <div className="text-sm font-medium flex items-center gap-2">
                       MacBook Pro <span className="text-[10px] bg-primary/10 text-primary px-1.5 rounded border border-primary/20">Current</span>
                    </div>
                    <div className="text-xs text-muted-foreground">San Francisco, USA • Chrome • 10.154.20.1</div>
                 </div>
              </div>
           </div>

           {/* Other Session */}
           <div className="px-6 py-4 flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-foreground" />
                 </div>
                 <div>
                    <div className="text-sm font-medium">iPhone 14</div>
                    <div className="text-xs text-muted-foreground">San Francisco, USA • Safari • Last active 2 hours ago</div>
                 </div>
              </div>
              <button className="text-xs border border-border px-3 py-1.5 rounded-md hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors flex items-center gap-2">
                 <LogOut className="w-3 h-3" /> Revoke
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}