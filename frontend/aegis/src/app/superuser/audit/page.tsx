"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Activity, 
  Search, 
  ShieldAlert, 
  UserX, 
  CheckCircle, 
  FileText,
  Clock,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuditLog {
  id: number;
  actor_email: string;
  action: string;
  target: string;
  details: string;
  ip_address: string;
  timestamp: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/admin/super/audit/");
        
        // FIX: Check if data is an array or a paginated object
        const data = Array.isArray(res.data) ? res.data : (res.data.results || []);
        
        setLogs(data);
      } catch (err) {
        console.error("Failed to fetch audit logs:", err);
        setLogs([]); // Fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Filter Logic
  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(search.toLowerCase()) || 
    log.target.toLowerCase().includes(search.toLowerCase()) ||
    log.actor_email.toLowerCase().includes(search.toLowerCase())
  );

  // Helper to pick icons based on action type
  const getActionIcon = (action: string) => {
    if (action.includes("APPROVED")) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (action.includes("REJECTED")) return <UserX className="w-4 h-4 text-red-500" />;
    if (action.includes("LOCKED")) return <ShieldAlert className="w-4 h-4 text-amber-500" />;
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-500" /> Compliance Audit
           </h1>
           <p className="text-zinc-400">Immutable record of administrative actions.</p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
           <input 
             type="text" 
             placeholder="Search logs..." 
             className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-zinc-400">
          <thead className="text-xs uppercase bg-white/5 text-zinc-300">
            <tr>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Actor (Admin)</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Target Entity</th>
              <th className="px-6 py-4 text-right">Metadata</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.length === 0 ? (
               <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500">
                     {loading ? "Loading ledger..." : "No audit records found."}
                  </td>
               </tr>
            ) : (
               filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <Clock className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
                       {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-white">
                       <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold">
                          {log.actor_email[0].toUpperCase()}
                       </span>
                       {log.actor_email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 rounded-md bg-white/5 border border-white/10">
                          {getActionIcon(log.action)}
                       </div>
                       <span className={cn(
                          "font-mono font-medium",
                          log.action.includes("LOCKED") ? "text-amber-500" :
                          log.action.includes("REJECTED") ? "text-red-500" :
                          "text-zinc-300"
                       )}>
                          {log.action}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {log.target}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-mono bg-zinc-950 px-2 py-1 rounded border border-white/10 text-zinc-500">
                       IP: {log.ip_address || "127.0.0.1"}
                    </span>
                  </td>
                </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}