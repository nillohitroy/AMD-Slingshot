"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  BrainCircuit, 
  Search, 
  ChevronDown, 
  CheckCircle, 
  FileText, 
  Loader2, 
  AlertTriangle, 
  ShieldAlert 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the Data Shape
interface LogEntry {
  id: number;
  user_email?: string; // From the update above
  agent: string;
  threat_signature: string;
  target_url: string;
  severity: number;
  ai_explanation?: string;
  is_resolved: boolean;
  time_ago: string;
}

export default function CognitiveLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/admin/sentinel/");
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        setLogs(data);
        // Default expand the first item if it has an explanation
        if (data.length > 0 && data[0].ai_explanation) {
            setExpandedId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Filter Logic
  const filteredLogs = logs.filter(log => 
    log.threat_signature.toLowerCase().includes(search.toLowerCase()) ||
    log.target_url.toLowerCase().includes(search.toLowerCase()) ||
    (log.user_email || "").toLowerCase().includes(search.toLowerCase())
  );

  // Helper: Map Severity (1-4) to a "Confidence" percentage for visuals
  const getConfidence = (severity: number) => {
     if (severity === 4) return 99;
     if (severity === 3) return 85;
     if (severity === 2) return 70;
     return 45;
  };

  if (loading) return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>;

  return (
    <div className="flex flex-col gap-6 fade-in-up pb-10">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
               <BrainCircuit className="w-6 h-6 text-purple-500" /> Cognitive Logs
            </h2>
            <p className="text-muted-foreground">Review AI reasoning for recent interventions.</p>
         </div>
         
         <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              className="w-full h-10 pl-9 pr-4 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary" 
              placeholder="Search logs..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      <div className="border border-border rounded-xl bg-background overflow-hidden">
         <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border">
               <tr>
                  <th className="px-6 py-4">Incident ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Threat Type</th>
                  <th className="px-6 py-4">AI Confidence</th>
                  <th className="px-6 py-4">Outcome</th>
                  <th className="px-6 py-4"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {filteredLogs.length === 0 ? (
                   <tr>
                       <td colSpan={6} className="p-8 text-center text-muted-foreground">No logs found matching your criteria.</td>
                   </tr>
               ) : filteredLogs.map((log) => (
                 <>
                     {/* Main Row */}
                     <tr 
                        key={log.id} 
                        className={cn(
                            "group hover:bg-muted/20 transition-colors cursor-pointer", 
                            expandedId === log.id && "bg-muted/30"
                        )}
                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                     >
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">LOG-{log.id}</td>
                        <td className="px-6 py-4 font-medium">
                            {log.user_email || "Unknown User"}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="font-medium text-foreground">{log.threat_signature}</span>
                              <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{log.target_url}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={cn("h-full", log.severity >= 3 ? "bg-purple-500" : "bg-blue-500")} 
                                    style={{ width: `${getConfidence(log.severity)}%`}} 
                                  />
                               </div>
                               <span className="text-xs font-mono">{getConfidence(log.severity)}%</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={cn(
                               "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                               log.is_resolved 
                                 ? "border-green-500/20 bg-green-500/10 text-green-500" 
                                 : "border-amber-500/20 bg-amber-500/10 text-amber-500"
                           )}>
                              {log.is_resolved ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              {log.is_resolved ? "Resolved" : "Action Req."}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 hover:bg-muted rounded-md inline-flex transition-transform duration-200">
                                <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedId === log.id && "rotate-180")} />
                           </button>
                        </td>
                     </tr>

                     {/* Expanded Detail Row */}
                     {expandedId === log.id && (
                        <tr className="bg-muted/10 animate-in fade-in zoom-in-95 duration-200">
                            <td colSpan={6} className="p-0">
                                <div className="p-6 border-l-4 border-l-purple-500 ml-0 flex items-start gap-4">
                                    <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
                                       <BrainCircuit className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div className="flex-1">
                                       <h4 className="font-semibold text-sm mb-1 text-purple-600 dark:text-purple-400">
                                           AI Reasoning Engine
                                       </h4>
                                       <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                                          {log.ai_explanation || "No AI analysis available for this event. Standard heuristic block applied based on known threat signatures."}
                                       </p>
                                       <div className="mt-4 flex gap-3">
                                          <button className="text-xs border border-border bg-background px-3 py-1.5 rounded-md hover:bg-muted flex items-center gap-2 transition-colors">
                                             <FileText className="w-3 h-3" /> View Raw Headers
                                          </button>
                                          {!log.is_resolved && (
                                              <button className="text-xs border border-red-200 bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400 transition-colors">
                                                 Mark False Positive
                                              </button>
                                          )}
                                       </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                     )}
                 </>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}