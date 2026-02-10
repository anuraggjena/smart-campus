"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  User, 
  Calendar, 
  AlertTriangle, 
  Filter, 
  Loader2, 
  ThumbsUp, 
  ThumbsDown, 
  Minus,
  ChevronLeft,
  ChevronRight,
  Quote
} from "lucide-react";

// --- TYPES ---
interface FeedbackItem {
  id: string;
  studentName: string;
  department: string;
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  priority: "HIGH" | "MEDIUM" | "LOW";
  message: string;
  createdAt: string;
}

// --- VISUAL HELPERS ---
const getSentimentStyle = (sentiment: string) => {
  switch (sentiment) {
    case "POSITIVE": return { 
      icon: ThumbsUp, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10 border-emerald-500/20",
      label: "Positive"
    };
    case "NEGATIVE": return { 
      icon: ThumbsDown, 
      color: "text-rose-400", 
      bg: "bg-rose-500/10 border-rose-500/20",
      label: "Negative"
    };
    default: return { 
      icon: Minus, 
      color: "text-blue-400", 
      bg: "bg-blue-500/10 border-blue-500/20",
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

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetch("/api/admin/feedback")
      .then((res) => res.json())
      .then((data) => {
          // Sort by date descending
          const sorted = Array.isArray(data) ? data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : [];
          setFeedbacks(sorted);
          setLoading(false);
      })
      .catch(err => {
          console.error(err);
          setLoading(false);
      });
  }, []);

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredData = useMemo(() => {
    return feedbacks.filter((fb) => filter === "ALL" ? true : fb.priority === filter);
  }, [feedbacks, filter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFilterChange = (newFilter: string) => {
      setFilter(newFilter);
      setCurrentPage(1); // Reset to page 1 on filter change
  };

  return (
    <div className="w-full relative p-6 md:p-10 space-y-8 min-h-screen text-white">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <MessageSquare size={16} className="text-rose-500 animate-pulse" />
               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Sentiment Analysis</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Student Feedback</h1>
            <p className="text-neutral-400 text-sm">Direct reports and satisfaction metrics from the student body.</p>
         </div>
         
         {/* Filter Tabs */}
         <div className="flex items-center bg-neutral-900 p-1 rounded-xl border border-white/10">
             {["ALL", "HIGH", "MEDIUM", "LOW"].map((f) => (
                 <button
                    key={f}
                    onClick={() => handleFilterChange(f)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        filter === f 
                        ? "bg-rose-600 text-white shadow-lg shadow-rose-900/50" 
                        : "text-neutral-500 hover:text-white hover:bg-white/5"
                    }`}
                 >
                    {f}
                 </button>
             ))}
         </div>
      </div>

      {/* --- FEEDBACK GRID --- */}
      {loading ? (
           <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 size={32} className="text-rose-500 animate-spin mb-4" />
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Decrypting Messages...</p>
          </div>
      ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-h-[400px]">
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
                                className="group relative p-6 rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-rose-500/20 transition-all flex flex-col justify-between backdrop-blur-sm"
                            >
                                 {/* Header: User & Priority */}
                                 <div className="flex justify-between items-start mb-4">
                                     <div className="flex items-center gap-3">
                                         <div className="h-10 w-10 rounded-full bg-neutral-800 border border-white/5 flex items-center justify-center text-neutral-400">
                                            <User size={16} />
                                         </div>
                                         <div>
                                             <h3 className="text-sm font-bold text-white group-hover:text-rose-100 transition-colors">{item.studentName}</h3>
                                             <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{item.department}</div>
                                         </div>
                                     </div>
                                     <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getPriorityStyle(item.priority)}`}>
                                         <AlertTriangle size={10} /> {item.priority}
                                     </div>
                                 </div>

                                 {/* Message Body */}
                                 <div className="flex-1 mb-6 relative pl-4 group-hover:border-rose-500/30 transition-colors">
                                     <Quote size={12} className="absolute -top-1 -left-1 text-neutral-600 -scale-x-100" />
                                     <p className="text-sm text-neutral-300 leading-relaxed italic">
                                         "{item.message}"
                                     </p>
                                 </div>

                                 {/* Footer: Sentiment & Date */}
                                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                     <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${sent.bg} ${sent.color}`}>
                                         <sent.icon size={14} />
                                         <span>{sent.label} Sentiment</span>
                                     </div>
                                     
                                     <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono">
                                         <Calendar size={12} />
                                         {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                     </div>
                                 </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                        <Filter size={24} />
                    </div>
                    <p className="text-neutral-400 font-medium">No feedback found</p>
                    <p className="text-neutral-600 text-xs mt-1">Try changing the priority filter</p>
                </div>
            )}

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-xs text-neutral-500 font-mono">
                        Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
                    </span>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-rose-500/30 transition-all"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-rose-500/30 transition-all"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
          </>
      )}

    </div>
  );
}