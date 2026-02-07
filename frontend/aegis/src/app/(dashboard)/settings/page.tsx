"use client";

import { Save, Camera, Building2 } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 fade-in-up">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold">Profile & General</h2>
        <p className="text-sm text-muted-foreground">Manage your public profile and institution details.</p>
      </div>

      {/* 1. Avatar Section */}
      <div className="flex items-center gap-6 p-6 border border-border rounded-xl bg-background">
        <div className="relative group cursor-pointer">
           <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5">
               <img 
                 src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                 alt="Profile"
                 className="rounded-full h-full w-full object-cover border-2 border-background"
               />
           </div>
           <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="w-6 h-6 text-white" />
           </div>
        </div>
        <div>
           <h3 className="font-semibold text-lg">Admin User</h3>
           <p className="text-sm text-muted-foreground mb-2">Administrator • State University</p>
           <button className="text-xs border border-border bg-background px-3 py-1.5 rounded-md hover:bg-muted transition-colors">
              Change Picture
           </button>
        </div>
      </div>

      {/* 2. Personal Info */}
      <div className="border border-border rounded-xl bg-background p-6 space-y-4">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3" defaultValue="Dr. Sarah Chen" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Work Email</label>
                <input type="email" className="flex h-10 w-full rounded-md border border-input bg-muted px-3 text-muted-foreground" defaultValue="admin@university.edu" disabled />
            </div>
        </div>
      </div>

      {/* 3. Institution Info */}
      <div className="border border-border rounded-xl bg-background p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
             <Building2 className="w-4 h-4 text-primary" />
             <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Institution Details</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">University Name</label>
                <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3" defaultValue="State University of Technology" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Domain</label>
                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 items-center text-sm text-muted-foreground">
                    @tech.edu
                </div>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Save className="w-4 h-4" /> Save Changes
          </button>
      </div>
    </div>
  );
}