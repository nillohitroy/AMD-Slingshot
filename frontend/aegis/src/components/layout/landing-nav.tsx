"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Logo } from "@/components/ui/logo";
import { useAuth } from "@/context/auth-context";
import { LogOut, LayoutDashboard, Shield, ChevronDown, User } from "lucide-react";

export function LandingNav() {
   const { user, logout } = useAuth();
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // Close dropdown when clicking outside
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   return (
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
         <div className="container mx-auto flex h-16 items-center justify-between px-6">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
               <Logo />
            </Link>

            {/* Center Links (Desktop Only) */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
               <Link href="/features" className="hover:text-primary transition-colors">Features</Link>
               <Link href="/security" className="hover:text-primary transition-colors">Security</Link>
               <Link href="/institutions" className="hover:text-primary transition-colors">Institutions</Link>
            </div>

            {/* Right Side: Dynamic Auth Area */}
            <div className="flex items-center gap-4">

               {user ? (
                  // STATE A: Logged In (Profile Menu)
                  <div className="relative" ref={dropdownRef}>
                     <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full border border-border bg-background/50 hover:bg-muted/50 transition-all outline-none focus:ring-2 focus:ring-primary/20"
                     >
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[1px]">
                           <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                              <span className="text-xs font-bold text-foreground">
                                 {user.name.charAt(0)}
                              </span>
                           </div>
                        </div>
                        <span className="text-sm font-medium hidden sm:inline-block">
                           {user.name.split(" ")[0]}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                     </button>

                     {/* Dropdown */}
                     {isOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-background shadow-lg p-1 animate-in fade-in zoom-in-95 origin-top-right">
                           <div className="px-3 py-2 border-b border-border mb-1">
                              <p className="text-sm font-semibold text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                           </div>

                           {/* FIXED DASHBOARD LINK LOGIC */}
                           <Link
                              href={
                                 user.role === 'SUPER_ADMIN' ? '/superuser' :
                                    user.role === 'STUDENT' ? '/student' :
                                       '/dashboard'
                              }
                              className="flex items-center rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                           >
                              {/* Dynamic Icon based on Role */}
                              {user.role === 'SUPER_ADMIN' ? (
                                 <Shield className="mr-2 h-4 w-4 text-red-500" /> // Super Admin gets a Red Shield
                              ) : user.role === 'STUDENT' ? (
                                 <Shield className="mr-2 h-4 w-4" />
                              ) : (
                                 <LayoutDashboard className="mr-2 h-4 w-4" />
                              )}
                              Dashboard
                           </Link>

                           <button
                              onClick={logout}
                              className="flex w-full items-center rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors mt-1"
                           >
                              <LogOut className="mr-2 h-4 w-4" /> Sign Out
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  // STATE B: Logged Out (Sign In Buttons)
                  <>
                     <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Sign In
                     </Link>
                     <Link href="/register" className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                        Get Started
                     </Link>
                  </>
               )}
            </div>
         </div>
      </nav>
   );
}