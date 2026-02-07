"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Key, Bell, CreditCard, Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Profile & General", href: "/settings", icon: User },
  { name: "Security & Access", href: "/settings/security", icon: Lock },
  { name: "API & Integrations", href: "/settings/api", icon: Key },
  { name: "Billing & Plans", href: "/settings/billing", icon: CreditCard },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-start pb-20">
      <aside className="w-full md:w-64 flex flex-col gap-1 shrink-0 sticky top-24">
         <div className="px-2 mb-4">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your institution profile.</p>
         </div>
         <nav className="flex flex-col gap-1">
           {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = pathname === item.href;
             return (
                <Link 
                   key={item.href} 
                   href={item.href}
                   className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                   )}
                >
                   <Icon className="w-4 h-4" /> 
                   {item.name}
                </Link>
             );
           })}
         </nav>
      </aside>
      <div className="flex-1 w-full min-w-0">
         {children}
      </div>
    </div>
  );
}