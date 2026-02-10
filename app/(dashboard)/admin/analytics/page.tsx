"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Activity, 
  FileText, 
  Settings, 
  AlertTriangle, 
  Lightbulb, 
  CheckCircle2, 
  Loader2
} from "lucide-react";

// --- LOGIC HELPER ---
function suggestion(item: any) {
  if (item.pci < 50)
    return "Students repeatedly struggle here. Rewrite this document with clearer steps and examples.";
  else if (item.followUps > item.total * 0.4)
    return "Students often ask follow-up questions. Add FAQ or examples to this document.";
  else if (item.lowConfidence > item.total * 0.3)
    return "AI frequently misclassifies this. Add clearer keywords and terminology.";
  else
    return "Minor clarity improvements recommended.";
}

// --- STYLE HELPERS ---
const getPCIStyle = (pci: number) => {
    if (pci >= 80) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 shadow-emerald-500/20";
    if (pci >= 50) return "text-amber-400 border-amber-500/20 bg-amber-500/10 shadow-amber-500/20";
    return "text-rose-400 border-rose-500/20 bg-rose-500/10 shadow-rose-500/20";
};

export default function AdminAnalytics() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!domain) return;
    setLoading(true);

    try {
        const res = await fetch(
        `/api/admin/analytics/pci/domain?domain=${domain}`
        );
        const data = await res.json();
        setResult(data);
    } catch (e) {
        console.error("Analysis failed", e);
    } finally {
        setLoading(false);
    }
  }

  const policies = result?.confusingItems.filter((i: any) => i.type === "POLICY") ?? [];
  const procedures = result?.confusingItems.filter((i: any) => i.type === "PROCEDURE") ?? [];

  return (
    <div className="w-full relative p-6 md:p-10 space-y-8 min-h-screen text-white">
      
      {/* --- CUSTOM SCROLLBAR STYLES --- */}
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(225, 29, 72, 0.5); /* Rose-500 */
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-rose-500 animate-pulse" />
            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Diagnostic Tools</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Domain Clarity Analytics</h1>
        <p className="text-neutral-400 text-sm">Run deep-scan analysis on specific domains to identify communication bottlenecks.</p>
      </div>

      {/* --- INPUT CONSOLE --- */}
      <div className="relative z-10 p-1 rounded-2xl bg-linear-to-r from-neutral-800 to-neutral-900 border border-white/10 shadow-xl max-w-3xl">
         <div className="flex items-center gap-2 bg-neutral-950 rounded-xl p-2 pr-2">
            <div className="pl-4 text-neutral-500">
                <Search size={20} />
            </div>
            <input 
                placeholder="ENTER DOMAIN ID (e.g., FEES, EXAMS...)" 
                className="flex-1 bg-transparent border-none text-white placeholder:text-neutral-600 focus:outline-none uppercase font-mono tracking-wider"
                value={domain}
                onChange={(e) => setDomain(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && analyze()}
            />
            <button 
                onClick={analyze}
                disabled={loading || !domain}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(225,29,72,0.3)]"
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
                {loading ? "SCANNING..." : "RUN DIAGNOSTICS"}
            </button>
         </div>
      </div>

      {/* --- RESULTS DISPLAY --- */}
      <AnimatePresence mode="wait">
        {result && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
            >
                {/* 1. HERO METRIC: PCI SCORE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3 p-8 rounded-3xl border border-white/10 bg-linear-to-br from-neutral-900 to-neutral-950 relative overflow-hidden flex items-center justify-between">
                        <div className="relative z-10">
                            <h2 className="text-lg font-bold text-neutral-300 mb-1">Calculated Clarity Index</h2>
                            <p className="text-sm text-neutral-500">Based on {result.interactions} recorded student interactions.</p>
                        </div>
                        
                        <div className="relative z-10 flex items-center gap-6">
                             <div className="text-right">
                                <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">Domain Health</div>
                                <div className={`text-sm font-bold ${result.pci >= 80 ? "text-emerald-400" : result.pci >= 50 ? "text-amber-400" : "text-rose-400"}`}>
                                    {result.pci >= 80 ? "OPTIMAL" : result.pci >= 50 ? "STABLE" : "CRITICAL"}
                                </div>
                             </div>
                             <div className={`text-6xl font-bold tracking-tighter ${result.pci >= 80 ? "text-emerald-500" : result.pci >= 50 ? "text-amber-500" : "text-rose-500"}`}>
                                {result.pci}%
                             </div>
                        </div>

                        {/* Background Glow */}
                        <div className={`absolute right-0 top-0 bottom-0 w-64 blur-[100px] opacity-20 pointer-events-none ${result.pci >= 80 ? "bg-emerald-600" : result.pci >= 50 ? "bg-amber-600" : "bg-rose-600"}`} />
                    </div>
                </div>

                {/* 2. CONFUSION MATRIX */}
                <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* POLICIES COLUMN */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1 border-b border-white/5 pb-2">
                            <FileText size={16} className="text-neutral-400" />
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Policy Bottlenecks</h3>
                        </div>
                        
                        {/* Added 'custom-scroll' class here */}
                        <div className="custom-scroll space-y-4 max-h-150 overflow-y-auto pr-2">
                            {policies.length === 0 ? (
                                <div className="p-8 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center">
                                    <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                                    <p className="text-neutral-400 text-sm">All policies performing optimally.</p>
                                </div>
                            ) : (
                                policies.map((item: any) => (
                                    <div key={item.code} className="p-5 rounded-xl border border-white/10 bg-neutral-900/60 hover:border-rose-500/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-rose-200 transition-colors">{item.title}</h4>
                                                <div className="text-[10px] font-mono text-neutral-500 mt-1">ID: {item.code}</div>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-[10px] font-bold border ${getPCIStyle(item.pci)}`}>
                                                PCI {item.pci}
                                            </div>
                                        </div>
                                        
                                        {/* Suggestion Box */}
                                        <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3">
                                            <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                                                <span className="text-amber-500 font-bold uppercase text-[9px] mr-2">Suggestion:</span>
                                                {suggestion(item)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* PROCEDURES COLUMN */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1 border-b border-white/5 pb-2">
                            <Settings size={16} className="text-neutral-400" />
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Procedure Friction</h3>
                        </div>

                        {/* Added 'custom-scroll' class here */}
                        <div className="custom-scroll space-y-4 max-h-150 overflow-y-auto pr-2">
                            {procedures.length === 0 ? (
                                <div className="p-8 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center">
                                    <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                                    <p className="text-neutral-400 text-sm">All procedures performing optimally.</p>
                                </div>
                            ) : (
                                procedures.map((item: any) => (
                                    <div key={item.code} className="p-5 rounded-xl border border-white/10 bg-neutral-900/60 hover:border-rose-500/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-rose-200 transition-colors">{item.title}</h4>
                                                <div className="text-[10px] font-mono text-neutral-500 mt-1">ID: {item.code}</div>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-[10px] font-bold border ${getPCIStyle(item.pci)}`}>
                                                PCI {item.pci}
                                            </div>
                                        </div>
                                        
                                        {/* Suggestion Box */}
                                        <div className="mt-4 p-3 rounded-lg bg-black/40 border border-white/5 flex gap-3">
                                            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                                                <span className="text-amber-500 font-bold uppercase text-[9px] mr-2">Action:</span>
                                                {suggestion(item)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}