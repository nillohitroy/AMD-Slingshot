"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Search, Lock, Unlock, Shield, GraduationCap, Building } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UserRegistry() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/super/users/?search=${search}`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id: number) => {
    try {
      await api.post(`/admin/super/users/${id}/toggle/`);
      // Update local state to reflect change instantly
      setUsers(users.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 fade-in-up">
      <div>
        <h1 className="text-2xl font-bold text-white">Global User Registry</h1>
        <p className="text-zinc-400">Search and maintain accounts across all institutions.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-zinc-400">
          <thead className="text-xs uppercase bg-white/5 text-zinc-300">
            <tr>
              <th className="px-6 py-4">User Identity</th>
              <th className="px-6 py-4">Role & Institution</th>
              <th className="px-6 py-4">Risk Score</th>
              <th className="px-6 py-4 text-right">Status / Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.length === 0 && !loading ? (
               <tr><td colSpan={4} className="p-8 text-center">No users found.</td></tr>
            ) : (
               users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-xs">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      {user.role === 'STUDENT' ? <GraduationCap className="w-3 h-3" /> : <Building className="w-3 h-3 text-amber-500" />}
                      <span className={cn(user.role === 'INSTITUTION_ADMIN' && "text-amber-500")}>{user.role}</span>
                    </div>
                    <div className="text-xs opacity-70">{user.institution}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    <span className={cn(
                      "px-2 py-0.5 rounded",
                      user.risk_score < 70 ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500"
                    )}>
                      {user.risk_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleUserStatus(user.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold ml-auto transition-all",
                        user.is_active 
                          ? "bg-zinc-800 text-zinc-400 hover:bg-red-500/20 hover:text-red-500" 
                          : "bg-red-500 text-white shadow-lg shadow-red-900/50"
                      )}
                    >
                      {user.is_active ? (
                        <>Active <Lock className="w-3 h-3" /></> 
                      ) : (
                        <>LOCKED <Unlock className="w-3 h-3" /></>
                      )}
                    </button>
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