"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Shield,
  Trophy,
  History,
  User,
  LogOut,
  ChevronDown,
  Settings
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, getInitials, isLoading } = useAuth();
  const router = useRouter();

  // State for Dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper: Get First Name only
  const firstName = user?.name ? user.name.split(" ")[0] : "Student";

  const navItems = [
    { name: "My Dashboard", href: "/student", icon: Shield },
    { name: "Training & Drills", href: "/student/drills", icon: Trophy },
    { name: "History", href: "/student/history", icon: History },
  ];

  // --- PROTECTION LOGIC ---
  useEffect(() => {
    // 1. Wait for Auth to finish loading from localStorage
    if (!isLoading) {
      // 2. If no user, kick them out
      if (!user) {
        router.push("/login");
      }
      // 3. If user exists but is NOT a student, kick them to their correct dashboard
      else if (user.role !== "STUDENT") {
        router.push("/dashboard"); // Redirect Admin to Admin Panel
      }
    }
  }, [user, isLoading, router]);

  // Show a loading spinner while checking permission to prevent "flashing" content
  if (isLoading || !user || user.role !== "STUDENT") {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  // ------------------------

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Student Topbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo Section */}
          <Link href="/student" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
          </Link>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1 sm:gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* DYNAMIC PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border border-transparent hover:bg-muted/50 hover:border-border transition-all outline-none focus:ring-2 focus:ring-primary/20"
            >
              {/* Avatar */}
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                {getInitials()}
              </div>

              {/* Name & Chevron */}
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium hidden md:inline-block">
                  {firstName}
                </span>
                <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200", isProfileOpen && "rotate-180")} />
              </div>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-border bg-background shadow-lg p-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                {/* User Info Header */}
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                {/* Menu Links */}
                <Link
                  href="/student/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <User className="mr-3 h-4 w-4" /> My Profile
                </Link>

                <Link
                  href="/student/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Settings className="mr-3 h-4 w-4" /> Preferences
                </Link>

                <div className="h-px bg-border my-1" />

                {/* Logout */}
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" /> Sign Out
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}