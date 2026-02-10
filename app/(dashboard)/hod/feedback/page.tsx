"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Minus, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Filter
} from "lucide-react";

// --- TYPES ---
interface FeedbackItem {
  id: string;
  studentName: string; // Name
  email: string;
  domain: string; // Academics, Hostel, etc.
  message: string; // Feedback Content
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE"; // Feeling
  priority: "LOW" | "MEDIUM" | "HIGH"; // Priority
  createdAt: string;
}

// --- VISUAL HELPERS ---
const getSentimentStyle = (sentiment: string) => {
  switch (sentiment) {
    case "POSITIVE": return { 
      icon: ThumbsUp, 
      style: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      label: "Positive"
    };
    case "NEGATIVE": return { 
      icon: ThumbsDown, 
      style: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      label: "Negative"
    };
    default: return { 
      icon: Minus, 
      style: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      label: "Neutral"
    };
  }
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "HIGH": return "text-rose-500 border-rose-500/30 bg-rose-500/10 shadow-[0_0_8px_rgba(244,63,94,0.2)]";
    case "MEDIUM": return "text-amber-500 border-amber-500/30 bg-amber-500/10";
    default: return "text-neutral-500 border-neutral-500/30 bg-neutral-500/10";
  }
};

export default function HodFeedbackPage() {
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Mock API call - replace with actual fetch("/api/hod/feedback")
    fetch("/api/hod/feedback")
      .then(res => res.json())
      .then(json => {
         // Sort by date descending
         setData(json.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
         setLoading(false);
      })
      .catch(err => {
         console.error(err);
         setLoading(false);
      });
  }, []);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
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
      
      {/* --- BACKGROUND GRADIENT & ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-neutral-950/80 to-neutral-950" />
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-amber-600/5 blur-[150px] rounded-full mix-blend-screen opacity-30" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-full mix-blend-screen opacity-30" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <MessageSquare size={16} className="text-amber-500" />
                 <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Student Intel</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 mb-2">
                  Feedback Feed
              </h1>
              <p className="text-neutral-400 text-sm">Direct reports, concerns, and suggestions from the student body.</p>
           </div>
           
           <div className="text-right hidden md:block border-r border-white/10 pr-6 mr-2">
                <div className="text-2xl font-bold text-white">{data.length}</div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Total Reports</div>
           </div>
        </div>

        {/* --- FEEDBACK GRID --- */}
        {loading ? (
             <div className="h-64 flex flex-col items-center justify-center text-amber-500 gap-4">
                <Loader2 size={40} className="animate-spin" />
                <p className="text-xs font-mono uppercase tracking-widest">Decrypting Messages...</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {paginatedData.map((item) => {
                            const sent = getSentimentStyle(item.sentiment);
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    key={item.id}
                                    className="group relative p-6 rounded-2xl border border-white/10 bg-neutral-900/40 backdrop-blur-sm hover:bg-neutral-900/60 hover:border-amber-500/20 transition-all flex flex-col justify-between"
                                >
                                    {/* Header Row: User Info & Priority */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 text-neutral-400">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white group-hover:text-amber-100 transition-colors">
                                                    {item.studentName}
                                                </div>
                                                <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                                                    <span>{item.email}</span>
                                                    Date
                                                    <span className="w-1 h-1 rounded-full bg-neutral-600" />                                                 <span className="font-mono text-neutral-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getPriorityStyle(item.priority)}`}>
                                            <AlertTriangle size={10} /> {item.priority} Priority
                                        </div>
                                    </div>

                                    {/* Message Body */}
                                    <div className="flex-1 mb-6">
                                        <div className="relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-white/5 rounded-full" />
                                            <p className="pl-4 text-sm text-neutral-300 leading-relaxed italic">
                                                "{item.message}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer: Sentiment & Domain */}
                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        {/* Sentiment (Feeling) */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${sent.style}`}>
                                            <sent.icon size={14} />
                                            <span>Feeling: {sent.label}</span>
                                        </div>

                                        {/* Domain Tag */}
                                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold bg-neutral-950 px-2 py-1 rounded border border-white/5">
                                            {item.domain}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                            <Filter size={24} />
                        </div>
                        <p className="text-neutral-400 font-medium">No feedback received</p>
                        <p className="text-neutral-600 text-xs mt-1">Check back later for student reports</p>
                    </div>
                )}

                {/* --- PAGINATION CONTROLS --- */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                        <span className="text-xs text-neutral-500 font-mono">
                            Showing Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
                        </span>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-amber-500/30 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-amber-500/30 transition-all"
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