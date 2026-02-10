"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Activity, 
  Megaphone, 
  Calendar, 
  ArrowUpRight, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Users,
  ShieldCheck,
  Loader2
} from "lucide-react";

// --- TYPES ---
interface DashboardData {
  overallPCI: number;
  interactions: number;
  domainPCI: {
    domain: string;
    pci: number;
    interactions: number;
  }[];
}

// --- HELPERS ---
const getPCIColor = (pci: number) => {
  if (pci >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (pci >= 50) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
};

const getPCILabel = (pci: number) => {
  if (pci >= 80) return "OPTIMAL";
  if (pci >= 50) return "MODERATE";
  return "CRITICAL";
};

export default function HodDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hod/dashboard")
      .then(res => res.json())
      .then(json => {
          setData(json);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, []);

  if (loading) {
      return (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-neutral-950 text-amber-500 gap-4">
              <Loader2 size={48} className="animate-spin" />
              <div className="text-sm font-mono uppercase tracking-widest">Initializing Command Deck...</div>
          </div>
      );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen w-full relative p-6 md:p-10 text-white overflow-hidden bg-neutral-950">
      
      {/* --- BACKGROUND GRADIENT & ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          {/* 1. Subtle Deep Wash Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-neutral-950/80 to-neutral-950" />
          
          {/* 2. Soft Ambient Glows (Reduced Opacity for Minimalism) */}
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-amber-600/5 blur-[150px] rounded-full mix-blend-screen opacity-40" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-full mix-blend-screen opacity-40" />
          
          {/* 3. Texture */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={16} className="text-amber-500" />
                 <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">System Overview</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 mb-2">
                  Command Deck
              </h1>
              <p className="text-neutral-400 text-sm">Real-time departmental metrics and clarity indices.</p>
           </div>
           
           <div className="flex gap-3">
               <Link href="/hod/announcements">
                   <button className="flex items-center gap-2 bg-neutral-800/80 hover:bg-neutral-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/10 backdrop-blur-md">
                        <Megaphone size={16} className="text-amber-500" /> New Broadcast
                   </button>
               </Link>
               <Link href="/hod/academics">
                   <button className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/10 border border-white/10">
                        <Calendar size={16} /> Schedule Ops
                   </button>
               </Link>
           </div>
        </div>

        {/* --- MAIN METRICS GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Main PCI Score Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 backdrop-blur-md p-8 flex flex-col justify-between shadow-2xl"
            >
                <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-bold text-white mb-1">Process Clarity Index (PCI)</h2>
                        <p className="text-sm text-neutral-400 max-w-md">
                            Aggregate score representing student understanding of departmental protocols.
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getPCIColor(data.overallPCI)}`}>
                        {getPCILabel(data.overallPCI)} Status
                    </div>
                </div>

                <div className="relative z-10 mt-8 flex items-end gap-4">
                    <div className="text-7xl font-bold tracking-tighter text-white drop-shadow-lg">
                        {data.overallPCI}<span className="text-3xl text-neutral-500 font-normal">%</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                        <TrendingUp size={14} /> +2.4% this week
                    </div>
                </div>

                {/* Progress Bar Visual */}
                <div className="mt-6 h-2 w-full bg-neutral-800/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${data.overallPCI}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full shadow-[0_0_10px_currentColor] ${data.overallPCI >= 80 ? 'bg-emerald-500 text-emerald-500' : data.overallPCI >= 50 ? 'bg-amber-500 text-amber-500' : 'bg-rose-500 text-rose-500'}`}
                    />
                </div>
            </motion.div>

            {/* 2. Total Interactions Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/60 to-neutral-950/60 backdrop-blur-md p-8 flex flex-col justify-center items-center relative overflow-hidden shadow-xl"
            >
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
                <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                    <Users size={32} />
                </div>
                <div className="text-5xl font-bold text-white mb-2 drop-shadow-md">{data.interactions}</div>
                <div className="text-sm text-neutral-400 font-bold uppercase tracking-wider">Total Queries</div>
                <p className="text-xs text-neutral-500 mt-2 text-center max-w-[200px]">
                    Student interactions logged across all channels this semester.
                </p>
            </motion.div>

        </div>

        {/* --- DOMAIN INTEL GRID --- */}
        <div>
            <div className="flex items-center gap-2 mb-4 px-1">
                <Activity size={16} className="text-neutral-400" />
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Sector Analysis</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.domainPCI.map((d, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        key={d.domain}
                        className="group p-6 rounded-2xl border border-white/10 bg-neutral-900/30 hover:bg-neutral-800/50 hover:border-amber-500/20 transition-all flex flex-col justify-between h-48 backdrop-blur-sm"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-lg font-bold text-white group-hover:text-amber-100 transition-colors">{d.domain}</h4>
                                <div className="text-xs text-neutral-500 font-mono mt-1">{d.interactions} Queries Logged</div>
                            </div>
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border shadow-inner ${getPCIColor(d.pci)}`}>
                                <span className="text-xs font-bold">{d.pci}</span>
                            </div>
                        </div>

                        {/* Visual Indicator of Health */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-medium">
                                Status: 
                                {d.pci >= 80 ? (
                                    <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12} /> Stable</span>
                                ) : (
                                    <span className="text-amber-400 flex items-center gap-1"><AlertTriangle size={12} /> Attention Needed</span>
                                )}
                            </div>

                            {/* Contextual Action Button */}
                            <Link href={["EXAMS", "ACADEMICS"].includes(d.domain) ? "/hod/academics" : "/hod/announcements"} className="block">
                                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-neutral-300 hover:text-white transition-all group-hover:border-amber-500/30">
                                    <ArrowUpRight size={14} />
                                    {["EXAMS", "ACADEMICS"].includes(d.domain) ? "Calibrate Schedule" : "Issue Notice"}
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}