"use client";

import { DashboardHeader } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "INSTITUTION_ADMIN" && user.role !== "SUPER_ADMIN") {
        router.push("/student"); // Redirect Student to Student Portal
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || (user.role !== "INSTITUTION_ADMIN" && user.role !== "SUPER_ADMIN")) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/10">
      {/* Sidebar is fixed width and full height naturally in flex container */}
      <Sidebar />
      
      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header stays at top, does not scroll away */}
        <DashboardHeader />
        
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
           <div className="mx-auto max-w-6xl space-y-8">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}