"use client";

import { User, Mail, Shield, Bell, LogOut, Smartphone } from "lucide-react";

export default function StudentProfilePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 fade-in-up pb-12">
      <div>
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>

      {/* Identity Card */}
      <div className="bg-background border border-border rounded-2xl p-6 flex items-center gap-6">
         <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-indigo-500 p-0.5 shrink-0">
            <div className="h-full w-full bg-background rounded-full flex items-center justify-center">
               <span className="text-2xl font-bold text-primary">AM</span>
            </div>
         </div>
         <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">Alex Miller</h2>
            <p className="text-muted-foreground text-sm truncate">Student • Computer Science • Year 2</p>
            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 w-fit px-2 py-1 rounded-full border border-emerald-500/20">
               <Shield className="w-3 h-3" /> Account Protected
            </div>
         </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
         
         {/* Account */}
         <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Account Security</h3>
            
            <div className="bg-background border border-border rounded-xl divide-y divide-border">
               <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                     <Mail className="w-5 h-5 text-muted-foreground" />
                     <div className="text-sm">
                        <div className="font-medium">Email Address</div>
                        <div className="text-muted-foreground text-xs">alex.m@university.edu</div>
                     </div>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Managed by Org</span>
               </div>

               <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                     <LockIcon />
                     <div className="text-sm">
                        <div className="font-medium">Change Password</div>
                        <div className="text-muted-foreground text-xs">Last changed 3 months ago</div>
                     </div>
                  </div>
                  <button className="text-xs border border-border px-3 py-1.5 rounded hover:bg-background">Update</button>
               </div>
               
               <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                     <Smartphone className="w-5 h-5 text-muted-foreground" />
                     <div className="text-sm">
                        <div className="font-medium">2FA Enforcement</div>
                        <div className="text-muted-foreground text-xs">Required by University Policy</div>
                     </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">Enabled</span>
               </div>
            </div>
         </div>

         {/* Notifications */}
         <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Notifications</h3>
            <div className="bg-background border border-border rounded-xl p-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Bell className="w-5 h-5 text-muted-foreground" />
                     <div className="text-sm">
                        <div className="font-medium">Security Alerts</div>
                        <div className="text-muted-foreground text-xs">Get notified when a threat is blocked.</div>
                     </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                     <input type="checkbox" className="sr-only peer" defaultChecked />
                     <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
               </div>
            </div>
         </div>

         {/* Logout Zone */}
         <button className="w-full py-3 rounded-xl border border-red-200 text-red-500 font-medium hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
         </button>

      </div>
    </div>
  );
}

const LockIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)