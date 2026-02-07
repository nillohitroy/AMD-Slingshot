"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { 
  LayoutDashboard, 
  Radar,           // For Live Sentinel
  BrainCircuit,    // For Cognitive Logs (The Analyst)
  Fingerprint,     // For Identity/Vault
  Crosshair,       // For Phishing Simulations (The Drill)
  ShieldCheck,     // For Policy/Agent Config
  Settings,
  LifeBuoy
} from "lucide-react";

const sidebarGroups = [
  {
    label: "Command Center",
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Live Sentinel",
        href: "/dashboard/sentinel",
        icon: Radar,
        description: "Real-time threat interception"
      },
    ]
  },
  {
    label: "Intelligence",
    items: [
      {
        title: "Cognitive Logs",
        href: "/dashboard/logs",
        icon: BrainCircuit,
        description: "AI-explained incident history"
      },
      {
        title: "Identity Radar",
        href: "/dashboard/identity",
        icon: Fingerprint,
        description: "Credential leak monitoring"
      },
    ]
  },
  {
    label: "Defense Ops",
    items: [
      {
        title: "Drill & Sim",
        href: "/dashboard/drills",
        icon: Crosshair,
        description: "AI-generated phishing tests"
      },
      {
        title: "Agent Policy",
        href: "/dashboard/policy",
        icon: ShieldCheck,
        description: "Configure intervention strictness"
      },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-background border-r border-border h-full w-[260px] flex flex-col shrink-0">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href='/'><Logo /></Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {sidebarGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </h3>
            <div className="flex flex-col gap-1">
              {group.items.map((item, index) => {
                const Icon = item.icon;
                const isActive = item.href === "/dashboard" 
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} />
                    {item.title}
                    
                    {/* Active Indicator Dot */}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Utilities */}
      <div className="border-t border-border p-4 space-y-1">
        <Link
            href="/dashboard/settings"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
          <Settings className="h-4 w-4" />
          System Settings
        </Link>
        <Link
            href="/dashboard/support"
            className="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
          <LifeBuoy className="h-4 w-4" />
          Support
        </Link>
      </div>
    </aside>
  );
}