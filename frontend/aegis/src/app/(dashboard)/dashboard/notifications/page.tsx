"use client";

import { 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Bell, 
  Clock, 
  Trash2, 
  MoreVertical 
} from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    title: "Critical Threat Intercepted",
    message: "Agent Sentry blocked a malicious payload targeting the Finance Dept subnet.",
    time: "2 mins ago",
    type: "critical",
    read: false,
  },
  {
    id: 2,
    title: "Phishing Drill Complete",
    message: "The 'Urgent Tuition' campaign has finished. 124 users failed the simulation.",
    time: "1 hour ago",
    type: "info",
    read: false,
  },
  {
    id: 3,
    title: "System Update Scheduled",
    message: "Aegis Core will undergo maintenance on Sunday at 3:00 AM EST.",
    time: "5 hours ago",
    type: "system",
    read: true,
  },
  {
    id: 4,
    title: "Identity Leak Detected",
    message: "Agent Guardian found 3 compromised credentials on a dark web forum.",
    time: "Yesterday",
    type: "warning",
    read: true,
  },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
           <h1 className="text-2xl font-bold flex items-center gap-2">
             <Bell className="w-6 h-6 text-foreground" /> Inbox
           </h1>
           <p className="text-muted-foreground">Recent alerts and system messages.</p>
        </div>
        <div className="flex gap-2">
           <button className="text-xs font-medium px-3 py-2 rounded-md hover:bg-muted transition-colors text-primary">
              Mark all as read
           </button>
           <button className="text-xs font-medium px-3 py-2 rounded-md hover:bg-muted transition-colors text-destructive hover:text-red-600">
              Clear all
           </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {notifications.map((note) => (
           <div 
             key={note.id} 
             className={cn(
               "group flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-sm",
               note.read 
                 ? "bg-background border-border" 
                 : "bg-muted/10 border-primary/20 shadow-sm relative overflow-hidden"
             )}
           >
              {/* Unread Indicator Line */}
              {!note.read && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}

              {/* Icon */}
              <div className={cn("mt-1 p-2 rounded-full shrink-0", 
                 note.type === "critical" ? "bg-red-500/10 text-red-500" :
                 note.type === "warning" ? "bg-amber-500/10 text-amber-500" :
                 note.type === "info" ? "bg-blue-500/10 text-blue-500" :
                 "bg-muted text-muted-foreground"
              )}>
                 {note.type === "critical" ? <ShieldAlert className="w-5 h-5" /> :
                  note.type === "warning" ? <ShieldAlert className="w-5 h-5" /> :
                  note.type === "info" ? <Info className="w-5 h-5" /> :
                  <CheckCircle2 className="w-5 h-5" />
                 }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start">
                    <h3 className={cn("font-semibold text-sm", !note.read && "text-foreground")}>
                       {note.title}
                    </h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                       <Clock className="w-3 h-3" /> {note.time}
                    </span>
                 </div>
                 <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {note.message}
                 </p>
                 
                 {/* Action Buttons (Visible on Hover) */}
                 <div className="flex gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs font-medium text-primary hover:underline">View Details</button>
                    {!note.read && <button className="text-xs text-muted-foreground hover:text-foreground">Mark read</button>}
                    <button className="text-xs text-muted-foreground hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                 </div>
              </div>
           </div>
        ))}

        {/* Empty State visual if needed */}
        {notifications.length === 0 && (
           <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Bell className="w-12 h-12 mb-4 opacity-20" />
              <p>No new notifications</p>
           </div>
        )}
      </div>
    </div>
  );
}