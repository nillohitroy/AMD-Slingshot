"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuth } from "@/context/auth-context"; // <--- Import Auth Hook
import { 
  Sun, Moon, Bell, Search, 
  User, Settings, CreditCard, LogOut, ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardHeader() {
  const { setTheme, theme } = useTheme();
  const { user, logout, getInitials } = useAuth(); // <--- Use Auth Hook
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-background border-border flex h-16 w-full shrink-0 items-center justify-between border-b px-6 z-40">
        {/* Left: Global Search */}
        <div className="flex items-center gap-4">
             <div className="bg-muted/50 text-muted-foreground flex h-9 w-64 items-center gap-2 rounded-md border border-transparent px-3 text-sm focus-within:border-primary/20 focus-within:bg-background hover:bg-muted transition-all">
                <Search className="h-4 w-4" />
                <input 
                    placeholder="Search..." 
                    className="bg-transparent placeholder:text-muted-foreground/70 flex-1 outline-none"
                />
             </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
            <Link href="/dashboard/notifications">
                <button className="hover:bg-muted text-muted-foreground relative flex h-9 w-9 items-center justify-center rounded-md transition-colors">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 border border-background"></span>
                </button>
            </Link>

            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-muted text-muted-foreground relative flex h-9 w-9 items-center justify-center rounded-md transition-colors"
            >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </button>
            
            <div className="h-4 w-px bg-border mx-1" />

            {/* DYNAMIC USER PROFILE */}
            <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:bg-muted/50 p-1 rounded-full md:rounded-lg transition-colors border border-transparent hover:border-border outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {/* Avatar Circle with Initials */}
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[1px]">
                     <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                        <span className="text-xs font-bold text-foreground">{getInitials()}</span>
                     </div>
                  </div>
                  
                  {/* Name Label */}
                  <div className="hidden md:flex flex-col items-start text-xs pr-1">
                     <span className="font-semibold text-foreground">{user?.name || "Admin User"}</span>
                     <span className="text-muted-foreground max-w-[100px] truncate">{user?.institution || "Aegis Admin"}</span>
                  </div>
                  <ChevronDown className={cn("hidden md:block h-3 w-3 text-muted-foreground transition-transform duration-200", isProfileOpen && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                   <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-background shadow-lg p-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                      <div className="px-3 py-2 border-b border-border mb-1">
                         <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                         <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>

                      <Link href="/settings" className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                         <User className="mr-3 h-4 w-4" /> Profile
                      </Link>
                      
                      <button 
                         onClick={logout} // <--- Calls Auth Context Logout
                         className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors mt-1"
                      >
                         <LogOut className="mr-3 h-4 w-4" /> Sign out
                      </button>
                   </div>
                )}
            </div>
        </div>
    </header>
  );
}