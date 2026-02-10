"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LifeBuoy, 
  Search, 
  Home, 
  CreditCard, 
  BookOpen, 
  Bus, 
  LayoutGrid,
  Building2,
  Zap,
  Briefcase,
  Filter
} from "lucide-react";

// --- TYPES ---
type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  owningOffice: string;
};

// --- ICON HELPER ---
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "HOSTEL": return Home;
    case "FEES": return CreditCard;
    case "LIBRARY": return BookOpen;
    case "TRANSPORT": return Bus;
    case "ACADEMICS": return Briefcase;
    default: return LayoutGrid;
  }
};

// --- COLOR HELPER ---
const getCategoryColor = (category: string) => {
  switch (category) {
    case "HOSTEL": return "rose";
    case "FEES": return "emerald";
    case "LIBRARY": return "amber";
    case "TRANSPORT": return "cyan";
    case "ACADEMICS": return "indigo";
    default: return "violet";
  }
};

export default function StudentServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/services")
      .then((res) => res.json())
      .then((data) => {
          setServices(data);
          setLoading(false);
      })
      .catch((e) => {
          console.error(e);
          setLoading(false);
      });
  }, []);

  // Filter Logic
  const filtered = useMemo(() => {
    return services
        .filter((s) => filter === "ALL" ? true : s.category === filter)
        .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
  }, [services, filter, search]);

  // Recommended Services (for top section)
  const recommended = useMemo(() => {
    return services.filter((s) =>
      ["FEES", "HOSTEL", "ACADEMICS"].includes(s.category)
    ).slice(0, 3);
  }, [services]);

  return (
    <div className="min-h-screen w-full relative p-6 md:p-10 text-white overflow-hidden bg-neutral-950">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <LifeBuoy size={16} className="text-cyan-400" />
                 <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Support Systems</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Campus Services</h1>
              <p className="text-neutral-400 text-sm">Centralized hub for all student support and facility requests.</p>
           </div>
        </div>

        {/* --- RECOMMENDED SECTION --- */}
        <section>
            <div className="flex items-center gap-2 mb-4 px-1">
                <Zap size={16} className="text-amber-400 fill-amber-400/20" />
                <h2 className="text-xs font-bold text-neutral-300 uppercase tracking-widest">Priority Services</h2>
            </div>
            
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {recommended.map((s) => {
                        const Icon = getCategoryIcon(s.category);
                        const color = getCategoryColor(s.category);
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={s.id}
                                className={`relative p-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden group hover:border-${color}-500/30 transition-all cursor-default`}
                            >
                                <div className={`absolute -right-8 -top-8 w-24 h-24 bg-${color}-500/10 blur-2xl rounded-full group-hover:bg-${color}-500/20 transition-all`} />
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                                            {s.category}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">{s.name}</h3>
                                    <p className="text-xs text-neutral-400 line-clamp-2">{s.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </section>

        {/* --- MAIN DIRECTORY --- */}
        <section className="space-y-6">
            
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 bg-neutral-900/50 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search services..."
                        className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:bg-black/40 focus:border-cyan-500/30 transition-all placeholder:text-neutral-600 h-full"
                    />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5 p-1">
                    {["ALL", "HOSTEL", "FEES", "LIBRARY", "TRANSPORT", "GENERAL"].map((c) => (
                        <button
                            key={c}
                            onClick={() => setFilter(c)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                filter === c 
                                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                                : "bg-white/5 border-transparent text-neutral-400 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((s) => {
                        const Icon = getCategoryIcon(s.category);
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                key={s.id}
                                className="group flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-default"
                            >
                                <div className="p-3 rounded-xl bg-neutral-900 border border-white/10 text-neutral-500 group-hover:text-white group-hover:border-white/20 transition-all">
                                    <Icon size={20} />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">{s.name}</h4>
                                        <span className="text-[10px] text-neutral-600 font-mono uppercase border border-white/5 px-1.5 rounded">{s.category.substring(0,3)}</span>
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">{s.description}</p>
                                    
                                    <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                                        <Building2 size={12} />
                                        <span>{s.owningOffice}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                    <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                        <Filter size={24} />
                    </div>
                    <p className="text-neutral-400 font-medium">No services found</p>
                    <p className="text-neutral-600 text-xs mt-1">Try adjusting your filters</p>
                </div>
            )}

        </section>

      </div>
    </div>
  );
}