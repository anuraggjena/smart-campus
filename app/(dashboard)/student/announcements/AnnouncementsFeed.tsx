"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Megaphone, 
  Calendar, 
  Clock, 
  CheckCircle2,
  Info
} from "lucide-react";

// --- TYPES ---
interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: "URGENT" | "IMPORTANT" | "NORMAL";
  activeFrom: string;
}

// --- HELPER: TIME GROUPING ---
function getTimeGroup(dateStr: string): "Today" | "This Week" | "Earlier" {
  const now = new Date();
  const from = new Date(dateStr);
  const diffDays = (now.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays <= 1) return "Today";
  if (diffDays <= 7) return "This Week";
  return "Earlier";
}

// --- COMPONENT: ANNOUNCEMENT CARD ---
const AnnouncementItem = ({ item }: { item: Announcement }) => {
  const isUrgent = item.priority === "URGENT";
  const isImportant = item.priority === "IMPORTANT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className={`relative p-5 rounded-2xl border transition-all group overflow-hidden
        ${isUrgent 
          ? "bg-rose-950/20 border-rose-500/30 hover:bg-rose-900/30" 
          : isImportant
            ? "bg-amber-950/20 border-amber-500/30 hover:bg-amber-900/30"
            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30"
        }
      `}
    >
      {isUrgent && (
         <div className="absolute -right-10 -top-10 h-32 w-32 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />
      )}

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-lg border shadow-inner
              ${isUrgent ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : 
                isImportant ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                "bg-white/5 border-white/10 text-neutral-400"}
           `}>
              {isUrgent ? <AlertTriangle size={18} /> : isImportant ? <Info size={18} /> : <Megaphone size={18} />}
           </div>
           <div>
              <h3 className={`text-sm font-bold ${isUrgent ? "text-rose-100" : isImportant ? "text-amber-100" : "text-white"}`}>
                {item.title}
              </h3>
              <div className="flex items-center gap-3 text-[10px] text-neutral-500 mt-0.5">
                 <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(item.activeFrom).toLocaleDateString()}</span>
                 {isUrgent && <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold uppercase tracking-wider">Urgent</span>}
                 {isImportant && <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wider">Important</span>}
              </div>
           </div>
        </div>
      </div>
      
      <p className="text-xs text-neutral-300 leading-relaxed pl-[52px] relative z-10">
        {item.message}
      </p>
    </motion.div>
  );
};

// --- MAIN CLIENT COMPONENT ---
export default function AnnouncementsFeed({ initialData }: { initialData: Announcement[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Filter Data
  const filteredData = initialData.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "ALL" || item.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // 2. Separate Urgent (Always shown at top, unpaginated if you prefer, or paginated. 
  // Let's keep Urgent separate as "Pinned" and paginate the rest for better UX)
  const urgentItems = filteredData.filter(i => i.priority === "URGENT");
  const feedItems = filteredData.filter(i => i.priority !== "URGENT");

  // 3. Paginate Feed Items
  const totalPages = Math.ceil(feedItems.length / itemsPerPage);
  const currentFeedItems = feedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 4. Reset Page on Search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterPriority]);

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8">
      
      {/* --- CONTROLS --- */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
           {/* Search Bar */}
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input 
                 type="text" 
                 placeholder="Search announcements..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-600"
              />
           </div>

           {/* Filter Dropdown */}
           <div className="relative min-w-[180px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <select 
                 value={filterPriority}
                 onChange={(e) => setFilterPriority(e.target.value)}
                 className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
              >
                 <option value="ALL" className="bg-neutral-900">All Priorities</option>
                 <option value="URGENT" className="bg-neutral-900 text-rose-400">Urgent</option>
                 <option value="IMPORTANT" className="bg-neutral-900 text-amber-400">Important</option>
                 <option value="NORMAL" className="bg-neutral-900">Standard</option>
              </select>
           </div>
      </div>

      {/* --- URGENT SECTION (Pinned) --- */}
      {urgentItems.length > 0 && currentPage === 1 && (
        <section className="space-y-4">
           <div className="flex items-center gap-2 mb-2 px-1">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Urgent Attention Required</h2>
           </div>
           <div className="grid gap-4">
              {urgentItems.map(item => (
                <AnnouncementItem key={item.id} item={item} />
              ))}
           </div>
        </section>
      )}

      {/* --- MAIN TIMELINE FEED --- */}
      <section className="space-y-6 min-h-[400px]">
        {currentFeedItems.length > 0 ? (
          currentFeedItems.map((item, index) => {
            // Dynamic Header Logic: Check if this item starts a new time group relative to the previous one
            const currentGroup = getTimeGroup(item.activeFrom);
            const prevItem = index > 0 ? currentFeedItems[index - 1] : null;
            const prevGroup = prevItem ? getTimeGroup(prevItem.activeFrom) : null;
            const showHeader = currentGroup !== prevGroup;

            return (
              <div key={item.id}>
                {showHeader && (
                  <div className="flex items-center gap-4 my-6 opacity-80">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full bg-black/40">
                      {currentGroup}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                )}
                <AnnouncementItem item={item} />
              </div>
            );
          })
        ) : (
          !urgentItems.length && (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl">
                <div className="p-4 rounded-full bg-white/5 text-neutral-600 mb-4">
                    <CheckCircle2 size={24} />
                </div>
                <p className="text-neutral-400 font-medium">All caught up</p>
                <p className="text-neutral-600 text-xs mt-1">No announcements match your criteria</p>
            </div>
          )
        )}
      </section>

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
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
}