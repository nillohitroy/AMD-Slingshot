"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { 
  Loader2, 
  LayoutGrid, 
  Building2, 
  Users, 
  Activity, 
  LogOut,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SuperLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "SUPER_ADMIN") {
        router.push("/login"); 
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "SUPER_ADMIN") {
    return <div className="h-screen bg-zinc-950 flex items-center justify-center"><Loader2 className="animate-spin text-red-500" /></div>;
  }

  const navItems = [
    { name: "Overview", href: "/superuser", icon: LayoutGrid },
    { name: "Institutions", href: "/superuser/institution", icon: Building2 },
    { name: "User Registry", href: "/superuser/users", icon: Users },
    { name: "Audit Logs", href: "/superuser/audit", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex">
       {/* Sidebar */}
       <aside className="w-64 border-r border-white/5 bg-zinc-900/50 flex flex-col fixed h-full z-10">
          <div className="h-16 flex items-center px-6 border-b border-white/5 gap-2">
             <ShieldAlert className="w-6 h-6 text-red-500" />
             <span className="font-bold tracking-tight text-white">Aegis <span className="text-red-500">GodMode</span></span>
          </div>

          <nav className="flex-1 p-4 space-y-1">
             <div className="text-xs font-mono text-zinc-500 mb-2 px-2">MAINTENANCE</div>
             {navItems.map((item) => {
               const isActive = pathname === item.href;
               return (
                 <Link 
                    key={item.href} 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                 >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                 </Link>
               );
             })}
          </nav>

          <div className="p-4 border-t border-white/5">
             <button 
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
             >
                <LogOut className="w-4 h-4" /> Sign Out
             </button>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto">
          {children}
       </main>
    </div>
  );
}