"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Building2, Globe, MoreHorizontal } from "lucide-react";

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<any[]>([]);

  useEffect(() => {
    // We can reuse the dashboard endpoint or create a specific list endpoint. 
    // For now, let's assume we create a quick list endpoint or filter the dashboard data.
    // Ideally: GET /api/super/institutions/
    // Since we haven't built that specific endpoint, I will mock the structure 
    // assuming you will duplicate the logic from the dashboard view but for all institutions.
    api.get("/admin/super/dashboard/").then(res => {
         // In a real app, create a dedicated endpoint. 
         // Here we just use the 'requests' for demo, but you'd want ACTIVE ones too.
         // Let's assume the API returns 'all_institutions' in a future update.
         setInstitutions(res.data.requests); 
    });
  }, []);

  return (
    <div className="space-y-6 fade-in-up">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-white">Network Grid</h1>
           <p className="text-zinc-400">Manage connected institutions and licenses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* Institution Card */}
         {institutions.map((inst) => (
             <div key={inst.id} className="bg-zinc-900 border border-white/10 rounded-xl p-6 group hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                      <Building2 className="w-5 h-5" />
                   </div>
                   <button className="text-zinc-500 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{inst.name}</h3>
                <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                   <Globe className="w-3 h-3" /> {inst.domain}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20">PENDING</span>
                   <span className="text-xs text-zinc-500">{new Date(inst.created_at).toLocaleDateString()}</span>
                </div>
             </div>
         ))}
         
         {/* Add Dummy Active Card for Visuals since we only have Pending in the API currently */}
         <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 group hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                  <Building2 className="w-5 h-5" />
               </div>
               <button className="text-zinc-500 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">State University</h3>
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
               <Globe className="w-3 h-3" /> state.edu
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
               <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20">ACTIVE</span>
               <span className="text-xs text-zinc-500">Students: 14,203</span>
            </div>
         </div>
      </div>
    </div>
  );
}