"use client";

import { Download, Shield, ArrowRight, CheckCircle2, FileJson, Chrome } from "lucide-react";
import Link from "next/link";

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8">
      
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Pitch */}
        <div className="space-y-6">
            <div className="h-14 w-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
                <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
                Activate Your <br />
                <span className="text-emerald-500">Digital Bodyguard</span>
            </h1>
            <p className="text-zinc-400 text-lg">
                The Aegis Student Guard runs quietly in your browser, blocking malicious sites and phishing attempts in real-time.
            </p>
            
            <div className="flex flex-col gap-4 pt-4">
                <a 
                    href="/aegis-guard.zip" 
                    download="aegis-guard.zip"
                    className="flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                >
                    <Download className="w-5 h-5" /> Download Extension (.zip)
                </a>
                <Link href="/dashboard" className="text-zinc-500 text-sm hover:text-white text-center">
                    Skip for now
                </Link>
            </div>
        </div>

        {/* Right Side: Instructions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <Chrome className="w-5 h-5 text-zinc-400" /> Installation Guide
            </h3>
            
            <div className="space-y-6 relative">
                {/* Connecting Line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-zinc-800" />

                {/* Step 1 */}
                <div className="relative flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-sm font-bold text-white z-10">1</div>
                    <div>
                        <h4 className="text-white font-medium">Download & Extract</h4>
                        <p className="text-sm text-zinc-400 mt-1">Download the zip file and extract it to a folder on your desktop.</p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-sm font-bold text-white z-10">2</div>
                    <div>
                        <h4 className="text-white font-medium">Open Chrome Extensions</h4>
                        <p className="text-sm text-zinc-400 mt-1">
                            Go to <span className="bg-zinc-800 px-1 rounded text-xs font-mono">chrome://extensions</span> and toggle 
                            <span className="text-white font-bold"> Developer Mode</span> (top right).
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-sm font-bold text-white z-10">3</div>
                    <div>
                        <h4 className="text-white font-medium">Load Unpacked</h4>
                        <p className="text-sm text-zinc-400 mt-1">Click "Load Unpacked" and select the folder you just extracted.</p>
                    </div>
                </div>

                 {/* Step 4 */}
                 <div className="relative flex gap-4">
                    <div className="h-8 w-8 rounded-full bg-emerald-500/20 border-2 border-zinc-950 flex items-center justify-center text-sm font-bold text-emerald-500 z-10">4</div>
                    <div>
                        <h4 className="text-white font-medium">Connect Account</h4>
                        <p className="text-sm text-zinc-400 mt-1">Click the Aegis icon in your toolbar and sign in.</p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}