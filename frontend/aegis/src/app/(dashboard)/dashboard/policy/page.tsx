"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { ShieldCheck, Eye, Lock, Globe, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce"; // You might need to install: npm i lodash @types/lodash

// Define the Policy Shape matching the backend model
interface PolicyConfig {
  sentry_paranoia_level: number;
  block_new_domains: boolean;
  detect_homoglyphs: boolean;
  allow_bypass: boolean;
  simple_explanations: boolean;
  gamified_quizzes: boolean;
  credential_reuse_monitor: boolean;
  dark_web_scan: boolean;
}

export default function PolicyPage() {
  const [policy, setPolicy] = useState<PolicyConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Data
  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const res = await api.get("/admin/policy/");
        setPolicy(res.data);
      } catch (err) {
        console.error("Failed to load policy:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  // 2. Update Handler (Debounced for Slider, Instant for Toggles)
  const updatePolicy = async (updates: Partial<PolicyConfig>) => {
    if (!policy) return;
    
    // Optimistic Update
    setPolicy((prev) => ({ ...prev!, ...updates }));
    setSaving(true);

    try {
      await api.patch("/admin/policy/", updates);
    } catch (err) {
      console.error("Failed to save policy:", err);
      // Revert on error would go here in a production app
    } finally {
      setTimeout(() => setSaving(false), 500); // Small delay for UX
    }
  };

  // Helper for Paranoia Level Label
  const getParanoiaLabel = (level: number) => {
    if (level < 30) return "LOW";
    if (level < 70) return "MEDIUM";
    return "HIGH";
  };

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;
  if (!policy) return null;

  return (
    <div className="max-w-4xl fade-in-up pb-10">
      <div className="mb-8 flex justify-between items-end">
         <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-foreground" /> Agent Policy
            </h2>
            <p className="text-muted-foreground">Configure AI sensitivity and intervention protocols.</p>
         </div>
         
         {/* Saving Indicator */}
         <div className={cn("flex items-center gap-2 text-sm font-medium transition-opacity", saving ? "text-primary opacity-100" : "text-muted-foreground opacity-0")}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Saved"}
         </div>
      </div>

      <div className="space-y-8">
         
         {/* SENTRY CONFIG */}
         <div className="border border-border rounded-xl bg-background p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
               <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-500" />
               </div>
               <div>
                  <h3 className="font-bold text-lg">Agent Sentry</h3>
                  <p className="text-sm text-muted-foreground">Network traffic and URL analysis.</p>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                     <label className="font-medium text-sm">Paranoia Level (Heuristic Sensitivity)</label>
                     <span className={cn(
                        "text-xs font-mono px-2 py-0.5 rounded font-bold transition-colors",
                        getParanoiaLabel(policy.sentry_paranoia_level) === "HIGH" ? "bg-red-500/10 text-red-500" :
                        getParanoiaLabel(policy.sentry_paranoia_level) === "MEDIUM" ? "bg-amber-500/10 text-amber-500" :
                        "bg-green-500/10 text-green-500"
                     )}>
                        {getParanoiaLabel(policy.sentry_paranoia_level)} ({policy.sentry_paranoia_level}%)
                     </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100"
                    value={policy.sentry_paranoia_level}
                    onChange={(e) => updatePolicy({ sentry_paranoia_level: parseInt(e.target.value) })}
                    className="w-full accent-blue-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer" 
                  />
                  <p className="text-xs text-muted-foreground">
                     High sensitivity may block legitimate sites with poor SSL configuration.
                  </p>
               </div>

               <div className="space-y-4 pt-2">
                  <ToggleItem 
                    title="Block Newly Registered Domains (<30 days)" 
                    desc="Prevent access to domains registered in the last month." 
                    active={policy.block_new_domains} 
                    onToggle={() => updatePolicy({ block_new_domains: !policy.block_new_domains })}
                  />
                  <ToggleItem 
                    title="Homoglyph Detection" 
                    desc="Block domains mimicking known services (e.g., 'gmai1.com')." 
                    active={policy.detect_homoglyphs} 
                    onToggle={() => updatePolicy({ detect_homoglyphs: !policy.detect_homoglyphs })}
                  />
                  <ToggleItem 
                    title="Allow Bypass" 
                    desc="Allow students to proceed to unsafe sites after a warning." 
                    active={policy.allow_bypass} 
                    onToggle={() => updatePolicy({ allow_bypass: !policy.allow_bypass })}
                  />
               </div>
            </div>
         </div>

         {/* ANALYST CONFIG */}
         <div className="border border-border rounded-xl bg-background p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
               <div className="h-10 w-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-500" />
               </div>
               <div>
                  <h3 className="font-bold text-lg">Agent Analyst</h3>
                  <p className="text-sm text-muted-foreground">Teach-back and Explainability Engine.</p>
               </div>
            </div>

            <div className="space-y-4">
               <ToggleItem 
                  title="Simple English Explanations" 
                  desc="Simplify technical jargon for non-engineering students." 
                  active={policy.simple_explanations} 
                  onToggle={() => updatePolicy({ simple_explanations: !policy.simple_explanations })}
               />
               <ToggleItem 
                  title="Gamified Quizzes" 
                  desc="Require a 1-question quiz to dismiss a warning." 
                  active={policy.gamified_quizzes} 
                  onToggle={() => updatePolicy({ gamified_quizzes: !policy.gamified_quizzes })}
               />
            </div>
         </div>

         {/* GUARDIAN CONFIG */}
         <div className="border border-border rounded-xl bg-background p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
               <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-500" />
               </div>
               <div>
                  <h3 className="font-bold text-lg">Agent Guardian</h3>
                  <p className="text-sm text-muted-foreground">Identity and Credential Protection.</p>
               </div>
            </div>

            <div className="space-y-4">
               <ToggleItem 
                  title="Credential Reuse Monitor" 
                  desc="Alert when university passwords are typed into external forms." 
                  active={policy.credential_reuse_monitor} 
                  onToggle={() => updatePolicy({ credential_reuse_monitor: !policy.credential_reuse_monitor })}
               />
               <ToggleItem 
                  title="Dark Web Periodic Scan" 
                  desc="Scan daily for .edu leaks on dark marketplaces." 
                  active={policy.dark_web_scan} 
                  onToggle={() => updatePolicy({ dark_web_scan: !policy.dark_web_scan })}
               />
            </div>
         </div>
      </div>
    </div>
  );
}

// Updated Helper Component with Click Handler
function ToggleItem({ title, desc, active, onToggle }: { title: string, desc: string, active: boolean, onToggle: () => void }) {
   return (
      <div className="flex items-center justify-between group">
         <div className="pr-4">
            <div className="font-medium text-sm text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">{desc}</div>
         </div>
         <label className="relative inline-flex items-center cursor-pointer">
            <input 
               type="checkbox" 
               className="sr-only peer" 
               checked={active} 
               onChange={onToggle}
            />
            <div className={cn(
               "w-11 h-6 peer-focus:outline-none rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors",
               active ? "bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" : "bg-muted"
            )}></div>
         </label>
      </div>
   );
}