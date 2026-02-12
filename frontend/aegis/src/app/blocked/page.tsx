"use client";

import { ShieldAlert, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function BlockedPage() {
  const searchParams = useSearchParams();
  const blockedUrl = searchParams.get('ref') || "Unknown Site";

  return (
    <div className="min-h-screen bg-red-950 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-zinc-900 border border-red-500/50 rounded-2xl p-10 text-center shadow-2xl relative overflow-hidden">
         
         <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />

         <div className="mx-auto h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-12 h-12 text-red-500" />
         </div>

         <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-wide">Access Denied</h1>
         <p className="text-zinc-400 text-lg mb-8">
            Aegis has blocked this page for your safety.
         </p>

         <div className="bg-black/40 rounded-lg p-4 mb-8 border border-red-500/20">
            <p className="text-xs text-red-400 font-mono mb-1 uppercase">Harmful Destination</p>
            <p className="text-white font-mono break-all">{blockedUrl}</p>
         </div>

         <div className="flex gap-4 justify-center">
            <Link 
                href="/dashboard"
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
                Return to Dashboard
            </Link>
         </div>

         <p className="mt-8 text-xs text-zinc-500 flex items-center justify-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            This event has been logged by your institution administrator.
         </p>
      </div>
    </div>
  );
}