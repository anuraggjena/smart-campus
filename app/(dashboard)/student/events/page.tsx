"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Layers,
  Globe,
  Loader2,
  CalendarDays
} from "lucide-react";

// --- TYPES ---
type Event = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  location?: string;
};

// --- COMPONENT: EVENT CARD ---
const EventCard = ({ event }: { event: Event }) => {
  const startDate = new Date(event.startDate);
  const day = startDate.getDate();
  const month = startDate.toLocaleString('default', { month: 'short' });
  const time = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      className="group relative flex flex-col md:flex-row gap-6 p-5 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-md hover:bg-white/5 hover:border-cyan-500/30 transition-all duration-300 overflow-hidden"
    >
      {/* Hover Glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-500/20 transition-all duration-500" />

      {/* Date Block */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-full md:w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shadow-inner group-hover:border-cyan-500/40 transition-colors">
         <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{month}</span>
         <span className="text-3xl font-bold text-white">{day}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 z-10">
         <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">{event.title}</h3>
         <p className="text-sm text-neutral-400 line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
         
         <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-500">
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/20 border border-white/5">
                <Clock size={12} className="text-indigo-400" />
                <span>{time}</span>
             </div>
             {event.location && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/20 border border-white/5">
                    <MapPin size={12} className="text-rose-400" />
                    <span>{event.location}</span>
                </div>
             )}
         </div>
      </div>

      {/* Action Indicator */}
      <div className="hidden md:flex items-center justify-center w-10">
          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-neutral-500 group-hover:bg-cyan-500 group-hover:text-black transition-all transform group-hover:scale-110">
              <CalendarDays size={16} />
          </div>
      </div>
    </motion.div>
  );
};

export default function StudentEventsPage() {
  const [tab, setTab] = useState<"DEPT" | "CAMPUS">("DEPT");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch Data
  useEffect(() => {
    setLoading(true);
    fetch(`/api/student/events?type=${tab}`)
      .then(res => res.json())
      .then(data => {
         // LOGIC FIXED: Sort by descending order (Newest/Latest first)
         // b - a = Descending
         const sorted = data.sort((a: any, b: any) => 
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
         );
         setEvents(sorted);
         setCurrentPage(1); 
         setLoading(false);
      })
      .catch(err => {
         console.error(err);
         setLoading(false);
      });
  }, [tab]);

  // Pagination Logic
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const paginatedEvents = events.slice(
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
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <Calendar size={16} className="text-cyan-400" />
                 <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Temporal Node</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Academic Timeline</h1>
              <p className="text-neutral-400 text-sm">Schedule of departmental and campus-wide operations.</p>
           </div>
           
           {/* Tab Switcher */}
           <div className="p-1 rounded-xl bg-neutral-900/80 border border-white/10 flex items-center backdrop-blur-md">
               <button
                  onClick={() => setTab("DEPT")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                     tab === "DEPT" 
                     ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-cyan-500/20" 
                     : "text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
               >
                  <Layers size={14} /> Department
               </button>
               <button
                  onClick={() => setTab("CAMPUS")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                     tab === "CAMPUS" 
                     ? "bg-indigo-500/10 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.2)] border border-indigo-500/20" 
                     : "text-neutral-500 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
               >
                  <Globe size={14} /> Campus
               </button>
           </div>
        </div>

        {/* --- EVENTS GRID --- */}
        <div className="min-h-[400px] space-y-4">
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                    <Loader2 size={32} className="text-cyan-400 animate-spin mb-4" />
                    <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Synchronizing Calendar...</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {paginatedEvents.length > 0 ? (
                        paginatedEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/5"
                        >
                            <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                                <Filter size={24} />
                            </div>
                            <p className="text-neutral-400 font-medium">No events scheduled</p>
                            <p className="text-neutral-600 text-xs mt-1">Check back later for incoming operations.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-xs text-neutral-500 font-mono">
                    Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
                </span>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:border-cyan-500/30 transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}