"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Clock, 
  AlertTriangle, 
  Loader2,
  Radio,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from "lucide-react";

// --- TYPES ---
type Announcement = {
  id: string;
  title: string;
  message: string;
  priority: "NORMAL" | "IMPORTANT" | "URGENT";
  activeFrom: string;
  activeUntil: string | null;
  isActive: boolean;
};

// --- BADGE HELPERS ---
const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "URGENT": return "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]";
    case "IMPORTANT": return "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
    default: return "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]";
  }
};

export default function HodAnnouncementsPage() {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [form, setForm] = useState({
    title: "",
    message: "",
    priority: "NORMAL",
    activeFrom: "",
    activeUntil: "",
  });

  // --- API HANDLERS ---
  async function load() {
    setLoading(true);
    try {
        const res = await fetch("/api/hod/announcements");
        const json = await res.json();
        // Sort by activeFrom Descending (Newest first)
        setData(json.sort((a: any, b: any) => new Date(b.activeFrom).getTime() - new Date(a.activeFrom).getTime()));
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

  // --- FORM HANDLERS ---
  function handleAddNew() {
    setForm({
        title: "",
        message: "",
        priority: "NORMAL",
        activeFrom: new Date().toISOString().slice(0, 16),
        activeUntil: "",
    });
    setEditingId(null);
    setIsEditorOpen(true);
  }

  function handleEdit(a: Announcement) {
    setForm({
        title: a.title,
        message: a.message,
        priority: a.priority,
        activeFrom: a.activeFrom ? new Date(a.activeFrom).toISOString().slice(0, 16) : "",
        activeUntil: a.activeUntil ? new Date(a.activeUntil).toISOString().slice(0, 16) : "",
    });
    setEditingId(a.id);
    setIsEditorOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
        ...form,
        activeFrom: new Date(form.activeFrom).toISOString(),
        activeUntil: form.activeUntil ? new Date(form.activeUntil).toISOString() : null,
    };

    try {
        if (editingId) {
            await fetch(`/api/hod/announcements/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            await fetch("/api/hod/announcements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }
        setIsEditorOpen(false);
        load();
    } catch (error) {
        console.error("Failed to save announcement", error);
    }
  }

  async function remove(id: string) {
    if(!confirm("Are you sure you want to delete this broadcast?")) return;
    try {
        await fetch(`/api/hod/announcements/${id}`, { method: "DELETE" });
        load();
    } catch (error) {
        console.error("Failed to delete announcement", error);
    }
  }

  const isExpired = (until: string | null) => {
      if (!until) return false;
      return new Date(until) < new Date();
  };

  return (
    <div className="min-h-screen w-full relative p-6 md:p-10 text-white overflow-hidden bg-neutral-950">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-600/5 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <Radio size={16} className="text-amber-500 animate-pulse" />
                 <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Broadcast Station</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Announcements</h1>
              <p className="text-neutral-400 text-sm">Deploy urgent alerts and department updates.</p>
           </div>
           
           <div className="flex items-center gap-4">
                {/* Stats (Desktop Only) */}
                <div className="hidden md:block text-right mr-4 border-r border-white/10 pr-6">
                   <div className="text-2xl font-bold text-white">{data.length}</div>
                   <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Total Msgs</div>
               </div>

               <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-amber-500/20 border border-white/10"
               >
                    <Plus size={18} /> New Broadcast
               </button>
           </div>
        </div>

        {/* --- LIST --- */}
        {loading ? (
             <div className="h-64 flex flex-col items-center justify-center">
                <Loader2 size={32} className="text-amber-500 animate-spin mb-4" />
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Loading Frequencies...</p>
            </div>
        ) : (
            <>
                <div className="space-y-4 min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {paginatedData.map((a) => {
                            const expired = isExpired(a.activeUntil);
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    key={a.id}
                                    className={`group relative p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row gap-6 items-start
                                        ${expired
                                            ? "bg-neutral-950/50 border-white/5 opacity-60" 
                                            : "bg-neutral-900/60 border-white/10 hover:border-amber-500/30 hover:bg-neutral-900/80"}
                                    `}
                                >
                                     {/* Icon Column */}
                                     <div className="flex-shrink-0 pt-1">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${expired ? 'bg-neutral-800 text-neutral-600 border-white/5' : 'bg-gradient-to-br from-neutral-800 to-neutral-900 text-amber-500 border-white/10 shadow-inner'}`}>
                                            <Megaphone size={20} />
                                        </div>
                                     </div>

                                     {/* Content */}
                                     <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className={`text-lg font-bold truncate ${expired ? 'text-neutral-500' : 'text-white'}`}>{a.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getPriorityStyles(a.priority)}`}>
                                                {a.priority}
                                            </span>
                                            {expired && (
                                                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border bg-neutral-800 text-neutral-500 border-neutral-700">
                                                    Expired
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm text-neutral-400 leading-relaxed max-w-4xl">{a.message}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-6 text-[10px] text-neutral-500 font-mono pt-3 border-t border-white/5 mt-3">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-neutral-400" /> 
                                                Posted: {new Date(a.activeFrom).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                            {a.activeUntil && (
                                                <span className={`flex items-center gap-1.5 ${expired ? 'text-rose-500/50' : 'text-amber-500/70'}`}>
                                                    <AlertTriangle size={12} /> 
                                                    Expires: {new Date(a.activeUntil).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </span>
                                            )}
                                        </div>
                                     </div>

                                     {/* Actions */}
                                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-start md:self-center">
                                        <button 
                                            onClick={() => handleEdit(a)}
                                            className="p-2.5 rounded-lg bg-neutral-800 border border-white/5 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                                            title="Edit Broadcast"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => remove(a.id)}
                                            className="p-2.5 rounded-lg bg-neutral-800 border border-white/5 hover:bg-rose-950 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 transition-colors"
                                            title="Delete Broadcast"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                     </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    
                    {data.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                                <Radio size={24} />
                            </div>
                            <p className="text-neutral-400 font-medium">No broadcasts active</p>
                            <p className="text-neutral-600 text-xs mt-1">Start a new transmission to reach students</p>
                        </div>
                    )}
                </div>

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
                                    {editingId ? "Edit Broadcast" : "Initialize Broadcast"}
                                </h2>
                                <button type="button" onClick={() => setIsEditorOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Title</label>
                                    <input 
                                        value={form.title}
                                        onChange={e => setForm({...form, title: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all placeholder:text-neutral-700"
                                        placeholder="e.g. Campus Closure Alert"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Message Body</label>
                                    <textarea 
                                        value={form.message}
                                        onChange={e => setForm({...form, message: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 focus:bg-black/60 transition-all resize-none h-32 placeholder:text-neutral-700"
                                        placeholder="Enter the details of the announcement..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Priority Level</label>
                                        <select 
                                            value={form.priority}
                                            onChange={e => setForm({...form, priority: e.target.value})}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
                                        >
                                            <option value="NORMAL">Normal</option>
                                            <option value="IMPORTANT">Important</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Post Date</label>
                                        <input 
                                            type="datetime-local"
                                            value={form.activeFrom}
                                            onChange={e => setForm({...form, activeFrom: e.target.value})}
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
                                    <Save size={16} /> Deploy
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