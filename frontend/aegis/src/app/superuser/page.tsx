"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { 
  Building2, 
  Users, 
  ShieldAlert, 
  Check, 
  X, 
  Loader2, 
  Server,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  total_institutions: number;
  pending_requests: number;
  total_students: number;
  global_threats: number;
  requests: Array<{
    id: number;
    name: string;
    domain: string;
    admin_email: string;
    created_at: string;
  }>;
}

export default function SuperDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/super/dashboard/");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: number, action: 'APPROVE' | 'REJECT') => {
    setProcessingId(id);
    try {
        await api.post(`/admin/super/institution/${id}/action/`, { action });
        // Refresh Data
        await fetchData();
    } catch (err) {
        alert("Action failed. Check console.");
        console.error(err);
    } finally {
        setProcessingId(null);
    }
  };

  if (loading) return <div className="pt-20 flex justify-center"><Loader2 className="animate-spin text-white" /></div>;
  if (!data) return null;

  return (
    <div className="space-y-8 fade-in-up">
      <div className="flex justify-between items-end">
         <div>
            <h1 className="text-3xl font-bold">System Overview</h1>
            <p className="text-zinc-400">Global Aegis network status.</p>
         </div>
         <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-mono border border-emerald-500/20">
            <Activity className="w-3 h-3" /> ALL SYSTEMS OPERATIONAL
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatCard 
            icon={Building2} 
            label="Active Institutions" 
            value={data.total_institutions} 
            color="text-blue-400" 
         />
         <StatCard 
            icon={Users} 
            label="Total Students Protected" 
            value={data.total_students} 
            color="text-purple-400" 
         />
         <StatCard 
            icon={Server} 
            label="Pending Approvals" 
            value={data.pending_requests} 
            color="text-amber-400" 
         />
         <StatCard 
            icon={ShieldAlert} 
            label="Active Global Threats" 
            value={data.global_threats} 
            color="text-red-400" 
         />
      </div>

      {/* Pending Approvals Section */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
         <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="font-semibold text-lg flex items-center gap-2">
               <Server className="w-5 h-5 text-zinc-400" /> Institution Requests
            </h3>
            <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
               {data.requests.length} PENDING
            </span>
         </div>
         
         <div className="divide-y divide-white/10">
            {data.requests.length === 0 ? (
               <div className="p-12 text-center text-zinc-500">
                  No pending requests. All caught up!
               </div>
            ) : (
               data.requests.map((req) => (
                  <div key={req.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                     <div className="flex-1">
                        <div className="flex items-center gap-3">
                           <h4 className="font-bold text-lg text-white">{req.name}</h4>
                           <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{req.domain}</span>
                        </div>
                        <div className="mt-1 text-sm text-zinc-400 flex gap-4">
                           <span>Admin: <span className="text-white">{req.admin_email}</span></span>
                           <span>•</span>
                           <span>Applied: {new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <button 
                           onClick={() => handleAction(req.id, 'REJECT')}
                           disabled={!!processingId}
                           className="px-4 py-2 rounded-lg border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 text-zinc-400 transition-all text-sm font-medium flex items-center gap-2"
                        >
                           <X className="w-4 h-4" /> Reject
                        </button>
                        <button 
                           onClick={() => handleAction(req.id, 'APPROVE')}
                           disabled={!!processingId}
                           className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-all text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           {processingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                           Approve & Onboard
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
   return (
      <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl">
         <div className="flex items-start justify-between mb-4">
            <div className={cn("p-2 rounded-lg bg-white/5", color)}>
               <Icon className="w-5 h-5" />
            </div>
         </div>
         <div className="text-2xl font-bold text-white">{value}</div>
         <div className="text-sm text-zinc-500">{label}</div>
      </div>
   );
}