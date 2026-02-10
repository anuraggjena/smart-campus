"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Clock, 
  Loader2,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from "lucide-react";

// --- TYPES ---
type EventType = "EXAM" | "ASSESSMENT" | "SCHEDULE";

interface AcademicEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
}

// --- BADGE HELPERS ---
const getTypeStyles = (type: EventType) => {
  switch (type) {
    case "EXAM":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]";
    case "ASSESSMENT":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
    case "SCHEDULE":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]";
    default:
      return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  }
};

export default function HodAcademicEvents() {
  const [data, setData] = useState<AcademicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const emptyForm: Omit<AcademicEvent, "id"> = {
    title: "",
    description: "",
    type: "SCHEDULE",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState(emptyForm);

  // --- API HANDLERS ---
  async function load() {
    setLoading(true);
    try {
        const res = await fetch("/api/hod/academics");
        const json = await res.json();
        // Sort by date descending
        setData(json.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedEvents = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- FORM HANDLERS ---
  function handleAddNew() {
    setForm(emptyForm);
    setEditingId(null);
    setIsEditorOpen(true);
  }

  function handleEdit(event: AcademicEvent) {
    setForm({
        title: event.title,
        description: event.description,
        type: event.type,
        startDate: event.startDate.split('T')[0],
        endDate: event.endDate ? event.endDate.split('T')[0] : "",
    });
    setEditingId(event.id);
    setIsEditorOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
        if (editingId) {
            await fetch(`/api/hod/academics/${editingId}`, {
                method: "PUT",
                body: JSON.stringify(form),
            });
        } else {
            await fetch("/api/hod/academics", {
                method: "POST",
                body: JSON.stringify(form),
            });
        }
        setIsEditorOpen(false);
        load();
    } catch (error) {
        console.error("Failed to save event", error);
    }
  }

  async function remove(id: string) {
    if(!confirm("Are you sure you want to delete this event?")) return;
    try {
        await fetch(`/api/hod/academics/${id}`, { method: "DELETE" });
        load();
    } catch (error) {
        console.error("Failed to delete event", error);
    }
  }

  return (
    <div className="min-h-screen w-full relative p-6 md:p-10 text-white overflow-hidden bg-neutral-950">
      
      {/* --- GRADIENT ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-b from-amber-600/10 to-transparent blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-t from-orange-600/10 to-transparent blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <GraduationCap size={16} />
                 </div>
                 <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Department Operations</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500 mb-2 drop-shadow-sm">
                  Academic Timeline
              </h1>
              <p className="text-neutral-400 text-sm">Manage exams, assessments, and departmental schedules.</p>
           </div>
           
           <div className="flex items-center gap-4">
               {/* Stats */}
               <div className="hidden md:block text-right mr-4 border-r border-white/10 pr-6">
                   <div className="text-2xl font-bold text-white">{data.length}</div>
                   <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Total Events</div>
               </div>

               <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20 border border-white/10"
               >
                    <Plus size={18} /> Schedule Event
               </button>
           </div>
        </div>

        {/* --- GRID --- */}
        {loading ? (
             <div className="h-64 flex flex-col items-center justify-center">
                <Loader2 size={32} className="text-amber-500 animate-spin mb-4" />
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Syncing Calendar...</p>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {paginatedEvents.map((event) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={event.id}
                                className="group relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 backdrop-blur-sm hover:from-amber-900/10 hover:to-neutral-900/60 hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-amber-900/10"
                            >
                                 {/* Hover Glow Effect */}
                                 <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full group-hover:bg-amber-500/20 transition-all duration-500 pointer-events-none" />

                                 {/* Date Badge */}
                                 <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-neutral-950/50 border border-white/10 w-14 h-14 group-hover:border-amber-500/30 transition-colors">
                                        <span className="text-[10px] text-neutral-400 uppercase font-bold">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-xl font-bold text-white">{new Date(event.startDate).getDate()}</span>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getTypeStyles(event.type)}`}>
                                        {event.type}
                                    </span>
                                 </div>

                                 {/* Content */}
                                 <div className="mb-6 relative z-10">
                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">{event.title}</h3>
                                    <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed group-hover:text-neutral-300 transition-colors">{event.description}</p>
                                 </div>

                                 {/* Footer */}
                                 <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                                        <Clock size={12} className="text-amber-500/70" />
                                        {event.endDate ? (
                                            <span>Ends {new Date(event.endDate).toLocaleDateString()}</span>
                                        ) : (
                                            <span>Single Day</span>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(event)}
                                            className="p-1.5 rounded-lg bg-neutral-800 border border-white/5 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => remove(event.id)}
                                            className="p-1.5 rounded-lg bg-neutral-800 border border-white/5 hover:bg-rose-950 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                 </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                        <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                            <Calendar size={24} />
                        </div>
                        <p className="text-neutral-400 font-medium">No active operations</p>
                        <p className="text-neutral-600 text-xs mt-1">Schedule exams or events to begin</p>
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

        {/* --- EDITOR OVERLAY --- */}
        <AnimatePresence>
            {isEditorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsEditorOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
                    >
                        <form onSubmit={submit}>
                            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-amber-500/5 to-transparent">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    {editingId ? "Modify Protocol" : "Initialize Event"}
                                </h2>
                                <button type="button" onClick={() => setIsEditorOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Event Title</label>
                                    <input 
                                        value={form.title}
                                        onChange={e => setForm({...form, title: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all placeholder:text-neutral-700"
                                        placeholder="e.g. Mid-Semester Examinations"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                                    <textarea 
                                        value={form.description}
                                        onChange={e => setForm({...form, description: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all resize-none h-28 placeholder:text-neutral-700"
                                        placeholder="Provide operational details..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Type</label>
                                        <select 
                                            value={form.type}
                                            onChange={e => setForm({...form, type: e.target.value as EventType})}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
                                        >
                                            <option value="EXAM">Exam</option>
                                            <option value="ASSESSMENT">Assessment</option>
                                            <option value="SCHEDULE">Schedule</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Start Date</label>
                                        <input 
                                            type="date"
                                            value={form.startDate}
                                            onChange={e => setForm({...form, startDate: e.target.value})}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 [color-scheme:dark]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditorOpen(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-6 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 uppercase tracking-wider"
                                >
                                    <Save size={16} /> Save Data
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}