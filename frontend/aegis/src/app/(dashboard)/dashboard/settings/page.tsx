"use client";

import { Save } from "lucide-react";

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6 fade-in-up">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold">General Information</h2>
        <p className="text-sm text-muted-foreground">Update your institution's public profile and contact info.</p>
      </div>

      {/* Profile Card */}
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Institution Name</label>
                <input 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  defaultValue="State University of Technology" 
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Domain</label>
                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground items-center">
                    @tech.edu
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">Admin Contact Email</label>
            <input 
              type="email" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              defaultValue="admin@tech.edu" 
            />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                    <option>(GMT-05:00) Eastern Time</option>
                    <option>(GMT-08:00) Pacific Time</option>
                    <option>(GMT+00:00) UTC</option>
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                </select>
            </div>
        </div>

        <div className="flex justify-end pt-4">
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                <Save className="w-4 h-4" /> Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}