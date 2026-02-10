"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Search, 
  Clock, 
  FileText, 
  Loader2, 
  X, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CalendarDays
} from "lucide-react";

// --- TYPES ---
type AcademicEvent = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

// --- VISUAL HELPERS ---
const getEventStatus = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (now < startDate) return { label: "UPCOMING", color: "text-blue-400 border-blue-500/20 bg-blue-500/10" };
    if (now >= startDate && now <= endDate) return { label: "ACTIVE", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10 animate-pulse" };
    return { label: "CONCLUDED", color: "text-neutral-500 border-neutral-700 bg-neutral-800" };
};

const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getMonthDay = (dateString: string) => {
    if (!dateString) return { month: "---", day: "--" };
    const d = new Date(dateString);
    return { 
        month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(), 
        day: d.getDate().toString().padStart(2, '0') 
    };
};

export default function AdminAcademicEvents() {
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  async function loadData() {
    setLoading(true);
    try {
        const res = await fetch("/api/admin/academics");
        const data = await res.json();
        // Sort by start date (newest/upcoming first)
        const sorted = Array.isArray(data) ? data.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) : [];
        setEvents(sorted);
    } catch(e) {
        console.error("Failed to load events", e);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const f = e.target;
    
    const payload = {
        title: f.title.value,
        description: f.description.value,
        startDate: f.startDate.value,
        endDate: f.endDate.value,
    };

    await fetch("/api/admin/academics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsCreatorOpen(false);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this event from the academic calendar?")) return;
    await fetch(`/api/admin/academics/${id}`, { method: "DELETE" });
    loadData();
  }

  // --- FILTER & PAGINATION ---
  const filteredEvents = events.filter(e => 
      e.title.toLowerCase().includes(search.toLowerCase()) || 
      e.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
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
    <div className="w-full relative p-6 md:p-10 space-y-8 min-h-screen text-white">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <CalendarDays size={16} className="text-rose-500 animate-pulse" />
               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Schedule Management</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Academic Calendar</h1>
            <p className="text-neutral-400 text-sm">Orchestrate terms, holidays, and institutional milestones.</p>
         </div>
         
         <div className="flex items-center gap-4 w-full md:w-auto">
             {/* Search Bar */}
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input 
                    placeholder="Search Events..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder:text-neutral-600"
                />
             </div>

             <button 
                  onClick={() => setIsCreatorOpen(true)}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 border border-white/10 whitespace-nowrap"
             >
                  <Plus size={18} /> Add Event
             </button>
         </div>
      </div>

      {/* --- EVENTS GRID --- */}
      {loading ? (
           <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 size={32} className="text-rose-500 animate-spin mb-4" />
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Synchronizing Timeline...</p>
          </div>
      ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-100">
                <AnimatePresence mode="popLayout">
                    {paginatedEvents.map((event) => {
                        const status = getEventStatus(event.startDate, event.endDate);
                        const dateObj = getMonthDay(event.startDate);

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={event.id}
                                className="group relative p-0 rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-rose-500/20 transition-all flex flex-col overflow-hidden backdrop-blur-sm"
                            >
                                 <div className="p-6 flex gap-5 items-start">
                                     {/* Calendar Leaf Visual */}
                                     <div className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-neutral-800 border border-white/10 overflow-hidden shadow-inner">
                                         <div className="w-full bg-rose-600/20 text-rose-500 text-[9px] font-bold uppercase text-center py-1 border-b border-rose-500/10">
                                             {dateObj.month}
                                         </div>
                                         <div className="text-2xl font-bold text-white py-1">
                                             {dateObj.day}
                                         </div>
                                     </div>

                                     <div className="flex-1 min-w-0">
                                         <div className="flex justify-between items-start mb-2">
                                             <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${status.color}`}>
                                                 {status.label}
                                             </div>
                                         </div>
                                         <h3 className="text-lg font-bold text-white mb-1 group-hover:text-rose-200 transition-colors line-clamp-1">{event.title}</h3>
                                         <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">{event.description}</p>
                                     </div>
                                 </div>

                                 {/* Footer */}
                                 <div className="mt-auto px-6 py-3 border-t border-white/5 bg-white/2 flex items-center justify-between">
                                     <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                                         <Clock size={12} />
                                         <span>{formatDate(event.startDate)} — {formatDate(event.endDate)}</span>
                                     </div>
                                     
                                     <button 
                                         onClick={() => handleDelete(event.id)}
                                         className="p-1.5 rounded bg-neutral-800 border border-white/5 hover:bg-rose-950 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                         title="Remove Event"
                                     >
                                         <Trash2 size={14} />
                                     </button>
                                 </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {paginatedEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                        <Filter size={24} />
                    </div>
                    <p className="text-neutral-400 font-medium">No events scheduled</p>
                    <p className="text-neutral-600 text-xs mt-1">Add a new event to populate the timeline</p>
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

      {/* --- CREATOR OVERLAY --- */}
      <AnimatePresence>
          {isCreatorOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsCreatorOpen(false)}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  />

                  <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
                  >
                      <form onSubmit={handleSubmit}>
                          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-linear-to-r from-rose-500/5 to-transparent">
                              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  Schedule New Event
                              </h2>
                              <button type="button" onClick={() => setIsCreatorOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                  <X size={20} />
                              </button>
                          </div>

                          <div className="p-6 space-y-5">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Event Title</label>
                                  <div className="relative">
                                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                                      <input 
                                          name="title"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all"
                                          placeholder="e.g. End Semester Examinations"
                                          required
                                      />
                                  </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Start Date</label>
                                      <input 
                                          type="date"
                                          name="startDate"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 scheme-dark"
                                          required
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">End Date</label>
                                      <input 
                                          type="date"
                                          name="endDate"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 scheme-dark"
                                          required
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                                  <textarea 
                                      name="description"
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all resize-none h-24"
                                      placeholder="Details regarding the event..."
                                      required
                                  />
                              </div>
                          </div>

                          <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                              <button 
                                  type="button"
                                  onClick={() => setIsCreatorOpen(false)}
                                  className="px-4 py-2 rounded-lg text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
                              >
                                  Cancel
                              </button>
                              <button 
                                  type="submit"
                                  className="px-6 py-2 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 uppercase tracking-wider"
                              >
                                  <Save size={16} /> Save to Calendar
                              </button>
                          </div>
                      </form>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

    </div>
  );
}