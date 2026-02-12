"use client";

import React, { useEffect, useState } from "react"; // 1. Import React
import api from "@/lib/api";
import { 
  BrainCircuit, 
  Search, 
  ChevronDown, 
  CheckCircle, 
  FileText, 
  Loader2, 
  AlertTriangle,
  Ban
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the Data Shape
interface LogEntry {
  id: number;
  user_email: string;
  type: string;
  threat_signature: string;
  url: string;
  status: string;
  ai_explanation?: string;
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
      } catch (err) {
        console.error("Failed to load logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.threat_signature.toLowerCase().includes(search.toLowerCase()) ||
    (log.url || "").toLowerCase().includes(search.toLowerCase()) ||
    (log.user_email || "").toLowerCase().includes(search.toLowerCase())
  );

  const getTypeInfo = (type: string) => {
     switch(type) {
         case 'BREACH': return { bg: 'bg-red-500', confidence: 99 };
         case 'PHISHING': return { bg: 'bg-orange-500', confidence: 85 };
         case 'BLOCK': return { bg: 'bg-purple-500', confidence: 75 };
         default: return { bg: 'bg-blue-500', confidence: 60 };
     }
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
                  <th className="px-6 py-4">Threat Signature</th>
                  <th className="px-6 py-4">AI Confidence</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
               </tr>
            </thead>
            <tbody className="divide-y divide-border">
               {filteredLogs.length === 0 ? (
                   <tr>
                       <td colSpan={6} className="p-8 text-center text-muted-foreground">No logs found.</td>
                   </tr>
               ) : filteredLogs.map((log) => {
                 const info = getTypeInfo(log.type);
                 return (
                 /* 2. FIX: Use React.Fragment with explicit key */
                 <React.Fragment key={log.id}>
                     <tr 
                        className={cn(
                            "group hover:bg-muted/20 transition-colors cursor-pointer", 
                            expandedId === log.id && "bg-muted/30"
                        )}
                        onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                     >
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">#{log.id}</td>
                        <td className="px-6 py-4 font-medium">
                            {log.user_email || "Unknown"}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="font-medium text-foreground">{log.threat_signature}</span>
                              <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{log.url}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={cn("h-full", info.bg)} 
                                    style={{ width: `${info.confidence}%`}} 
                                  />
                               </div>
                               <span className="text-xs font-mono">{info.confidence}%</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={cn(
                               "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                               log.status === 'RESOLVED'
                                 ? "border-green-500/20 bg-green-500/10 text-green-500" 
                                 : "border-amber-500/20 bg-amber-500/10 text-amber-500"
                           )}>
                              {log.status === 'RESOLVED' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              {log.status}
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
                                       <h4 className="font-semibold text-sm mb-1 text-purple-600">
                                           AI Analysis
                                       </h4>
                                       <p className="text-sm text-foreground/80 leading-relaxed max-w-3xl">
                                          {log.ai_explanation || "Automated heuristics detected a potential threat pattern matching known blocklists. No specific generative explanation was stored for this event."}
                                       </p>
                                       
                                       <div className="mt-4 flex gap-3">
                                          {log.status !== 'RESOLVED' && (
                                              <button 
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    /* 3. FIX: Removed extra '/api' prefix */
                                                    await api.post(`/sentry/resolve/${log.id}/`);
                                                    window.location.reload();
                                                }}
                                                className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-md hover:bg-emerald-600 transition-colors"
                                              >
                                                 Resolve Incident
                                              </button>
                                          )}
                                       </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                     )}
                 </React.Fragment>
                 );
               })}
            </tbody>
         </table>
      </div>
    </div>
  );
}