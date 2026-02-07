"use client";

import { Mail, Smartphone, Slack } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-8 fade-in-up">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground">Control how and when you receive alerts.</p>
      </div>

      <div className="space-y-6">
        <div className="border border-border rounded-lg bg-background overflow-hidden">
             {/* Header */}
            <div className="bg-muted/30 px-6 py-3 border-b border-border grid grid-cols-4 gap-4">
                <div className="col-span-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alert Type</div>
                <div className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</div>
                <div className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slack</div>
            </div>

            {/* Rows */}
            <NotificationRow 
                title="Critical Threat Detected" 
                desc="Immediate alert when high-confidence malware or active phishing is blocked."
                email={true}
                slack={true}
            />
             <NotificationRow 
                title="Identity Leak Alert" 
                desc="When a student credential is found on the dark web."
                email={true}
                slack={false}
            />
             <NotificationRow 
                title="Weekly Security Report" 
                desc="A summary of all blocked threats and drill performance."
                email={true}
                slack={false}
            />
             <NotificationRow 
                title="System Maintenance" 
                desc="Planned downtime or major feature updates."
                email={false}
                slack={false}
            />
        </div>

        {/* Contact Methods */}
        <div className="pt-4">
            <h3 className="text-sm font-semibold mb-4">Contact Methods</h3>
            <div className="grid gap-3 max-w-lg">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">admin@tech.edu</span>
                    </div>
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">Verified</span>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg opacity-60">
                     <div className="flex items-center gap-3">
                        <Slack className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Slack Workspace</span>
                    </div>
                    <button className="text-xs text-primary hover:underline">Connect</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function NotificationRow({ title, desc, email, slack }: any) {
    return (
        <div className="grid grid-cols-4 gap-4 px-6 py-4 border-b border-border last:border-0 items-center">
            <div className="col-span-2">
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
            <div className="flex justify-center">
                <input type="checkbox" defaultChecked={email} className="accent-primary h-4 w-4" />
            </div>
            <div className="flex justify-center">
                <input type="checkbox" defaultChecked={slack} className="accent-primary h-4 w-4" />
            </div>
        </div>
    )
}