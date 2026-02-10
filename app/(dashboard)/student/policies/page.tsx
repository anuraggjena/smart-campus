"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Shield, 
  Filter, 
  ChevronRight, 
  Lock, 
  Building2,
  Loader2,
  FileCheck,
  ChevronLeft
} from "lucide-react";

type Policy = {
  id: string;
  code: string;
  title: string;
  domain: string;
  content: string;
  version: string;
  owningOffice: string;
};

// --- DOMAIN BADGE HELPER ---
const getDomainColor = (domain: string) => {
  switch (domain) {
    case "ACADEMICS": return "indigo";
    case "HOSTEL": return "rose";
    case "FEES": return "emerald";
    case "EXAMS": return "amber";
    default: return "cyan";
  }
};

export default function StudentPoliciesPage() {
  const [data, setData] = useState<Policy[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3x3 Grid

  useEffect(() => {
    fetch("/api/student/policies")
      .then((res) => res.json())
      .then((json) => {
          setData(json);
          setLoading(false);
      })
      .catch((e) => {
          console.error(e);
          setLoading(false);
      });
  }, []);

  // Filter Data
  const filtered = useMemo(() => {
    return data
      .filter((p) => filter === "ALL" ? true : p.domain === filter)
      .filter((p) => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.code.toLowerCase().includes(search.toLowerCase())
      );
  }, [data, filter, search]);

  // --- PAGINATION LOGIC ---
  
  // 1. Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  // 2. Calculate slices
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedPolicies = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full relative p-6 md:p-10 text-white overflow-hidden bg-neutral-950">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <Shield size={16} className="text-emerald-400" />
                 <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Regulatory Database</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Policy Vault</h1>
              <p className="text-neutral-400 text-sm">Access official campus rules, regulations, and protocols.</p>
           </div>
           
           {/* Stats */}
           <div className="text-right hidden md:block">
               <div className="text-2xl font-bold text-white">{filtered.length}</div>
               <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Documents Found</div>
           </div>
        </div>

        {/* --- CONTROLS --- */}
        <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by policy name or code..."
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-neutral-900 transition-all placeholder:text-neutral-600"
                />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
                {["ALL", "ACADEMICS", "EXAMS", "FEES", "HOSTEL", "GENERAL"].map((d) => (
                    <button
                        key={d}
                        onClick={() => setFilter(d)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${
                            filter === d 
                            ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                            : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </div>

        {/* --- CONTENT AREA --- */}
        {loading ? (
            <div className="h-64 flex flex-col items-center justify-center">
                <Loader2 size={32} className="text-emerald-500 animate-spin mb-4" />
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Decryption in progress...</p>
            </div>
        ) : (
            <>
                {/* LOGIC CHANGE: Check for items first. If items exist, show Grid. If not, show Empty State. */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {paginatedPolicies.map((p) => {
                                const color = getDomainColor(p.domain);
                                return (
                                    <Link href={`/student/policies/${p.id}`} key={p.id} className="h-full">
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group h-full relative p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm hover:bg-white/5 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                                        >
                                            {/* Hover Glow */}
                                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-all duration-500" />

                                            <div>
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`px-2 py-1 rounded bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 text-[10px] font-bold uppercase tracking-wider`}>
                                                        {p.domain}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
                                                        <Lock size={10} /> v{p.version}
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors line-clamp-2">
                                                    {p.title}
                                                </h3>
                                                <div className="text-xs text-neutral-500 font-mono mb-4">{p.code}</div>
                                            </div>

                                            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                                                    <Building2 size={12} /> {p.owningOffice}
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                    <ChevronRight size={16} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    /* EMPTY STATE REPLACES THE GRID */
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 min-h-[400px]">
                        <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                            <Filter size={24} />
                        </div>
                        <p className="text-neutral-400 font-medium">No documents found</p>
                        <p className="text-neutral-600 text-xs mt-1">Try adjusting your search criteria</p>
                    </div>
                )}

                {/* --- PAGINATION CONTROLS --- */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                        <span className="text-xs text-neutral-500 font-mono">
                            Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
                        </span>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-emerald-500/30 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-emerald-500/30 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </>
        )}

      </div>
    </div>
  );
}