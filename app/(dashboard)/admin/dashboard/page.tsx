"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  ShieldAlert, 
  Building2, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Server,
  Loader2
} from "lucide-react";

// --- TYPES ---
type DomainPCI = {
  domain: string;
  pci: number;
  interactions: number;
};

type DeptPCI = {
  department: string;
  pci: number;
  interactions: number;
};

export default function AdminDashboard() {
  const [overallPCI, setOverallPCI] = useState(0);
  const [domains, setDomains] = useState<DomainPCI[]>([]);
  const [departments, setDepartments] = useState<DeptPCI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        setOverallPCI(data.overallPCI);
        setDomains(data.domainPCI || []);
        setDepartments(data.departmentPCI || []);
        setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, []);

  // Updated color logic for Dark Theme
  const getStatusColor = (pci: number) => {
    if (pci >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    if (pci >= 50) return "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
  };

  const getStatusIcon = (pci: number) => {
      if (pci >= 80) return <CheckCircle2 size={14} />;
      if (pci >= 50) return <Activity size={14} />;
      return <AlertTriangle size={14} />;
  };

  if (loading) {
      return (
          <div className="h-full w-full flex flex-col items-center justify-center min-h-[60vh] text-rose-500 gap-4">
              <Loader2 size={48} className="animate-spin" />
              <div className="text-sm font-mono uppercase tracking-widest">Accessing Mainframe...</div>
          </div>
      );
  }

  return (
    // Added padding (p-6) and removed min-h-screen so it fits inside the layout naturally
    <div className="w-full relative p-6 md:p-10 space-y-8 pb-20">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-900/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Container to constrain width */}
      <div className="max-w-7xl mx-auto relative z-10 space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <ShieldAlert size={16} className="text-rose-500 animate-pulse" />
                 <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Root Administration</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">System Dashboard</h1>
              <p className="text-neutral-400 text-sm">Global oversight of institutional process clarity and interaction metrics.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* --- HERO METRIC: OVERALL PCI --- */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-3 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-32 bg-rose-600/5 blur-3xl rounded-full pointer-events-none" />
                
                <div className="z-10 text-center md:text-left">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
                        <Activity className="text-rose-500" /> 
                        Process Clarity Index
                    </h2>
                    <p className="text-neutral-400 max-w-lg leading-relaxed">
                        Real-time aggregation of student comprehension across all campus domains. High scores indicate effective communication protocols.
                    </p>
                </div>

                <div className="z-10 flex items-center gap-6">
                    <div className="relative">
                        {/* Circular Glow */}
                        <div className={`absolute inset-0 blur-2xl opacity-20 rounded-full ${overallPCI >= 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="text-7xl font-bold text-white tracking-tighter drop-shadow-lg">
                            {overallPCI}<span className="text-3xl text-neutral-600 font-normal">%</span>
                        </div>
                    </div>
                    <div className={`hidden md:flex h-16 w-1 rounded-full ${overallPCI >= 50 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`} />
                    <div className="hidden md:block text-right">
                        <div className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1">System Status</div>
                        <div className={`text-sm font-bold ${overallPCI >= 80 ? 'text-emerald-400' : overallPCI >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                            {overallPCI >= 80 ? 'OPTIMAL' : overallPCI >= 50 ? 'MODERATE' : 'CRITICAL'}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* --- LEFT COL: DOMAIN METRICS --- */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2 px-1">
                    <Layers size={16} className="text-neutral-400" />
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Domain Diagnostics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {domains.map((d, i) => (
                        <motion.div
                            key={d.domain}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-5 rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-rose-500/20 transition-all backdrop-blur-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-bold text-white group-hover:text-rose-200 transition-colors">{d.domain}</h4>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${getStatusColor(d.pci)}`}>
                                    {getStatusIcon(d.pci)}
                                    {d.pci}%
                                </div>
                            </div>
                            
                            <div className="w-full bg-neutral-800/50 h-1.5 rounded-full overflow-hidden mb-3">
                                <div 
                                  className={`h-full rounded-full ${d.pci >= 80 ? 'bg-emerald-500' : d.pci >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                                  style={{ width: `${d.pci}%` }} 
                                />
                            </div>

                            <div className="flex justify-between items-center text-xs text-neutral-500 font-mono">
                                <span>Load Analysis</span>
                                <span className="text-white font-bold">{d.interactions} <span className="text-neutral-600 font-normal">Queries</span></span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- RIGHT COL: DEPARTMENT METRICS --- */}
            <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-2 px-1">
                    <Building2 size={16} className="text-neutral-400" />
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Departmental Health</h3>
                </div>

                <div className="space-y-3">
                    {departments.map((d, i) => (
                        <motion.div
                            key={d.department}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${d.pci >= 80 ? 'bg-emerald-500' : d.pci >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                <div>
                                    <div className="text-sm font-bold text-white">{d.department}</div>
                                    <div className="text-[10px] text-neutral-500">{d.interactions} Interactions</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={`text-sm font-bold ${d.pci >= 80 ? 'text-emerald-400' : d.pci >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                    {d.pci}%
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}