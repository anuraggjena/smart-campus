"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Search, 
  Radio, 
  Users, 
  Building2, 
  Calendar, 
  Loader2,
  X,
  Send,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle
} from "lucide-react";

// --- TYPES ---
type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: "ALL" | "HOSTELLERS_ONLY" | "DEPARTMENT_ONLY";
  departmentId: string | null;
  priority: "NORMAL" | "IMPORTANT" | "URGENT";
  activeFrom: string;
  activeUntil: string | null;
};

type Department = {
  id: string;
  name: string;
  code: string;
};

// --- VISUAL HELPERS ---
const getPriorityStyle = (priority: string) => {
    switch(priority) {
        case "URGENT": return "text-rose-400 border-rose-500/20 bg-rose-500/10 shadow-[0_0_8px_rgba(244,63,94,0.2)]";
        case "IMPORTANT": return "text-amber-400 border-amber-500/20 bg-amber-500/10";
        default: return "text-blue-400 border-blue-500/20 bg-blue-500/10";
    }
};

const getAudienceIcon = (audience: string) => {
    switch(audience) {
        case "HOSTELLERS_ONLY": return <Building2 size={12} />;
        case "DEPARTMENT_ONLY": return <Users size={12} />;
        default: return <Radio size={12} />;
    }
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
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
        const [a, d] = await Promise.all([
            fetch("/api/admin/announcements").then(r => r.json()),
            fetch("/api/departments").then(r => r.json())
        ]);
        const sorted = Array.isArray(a) ? a.sort((x: any, y: any) => new Date(y.activeFrom).getTime() - new Date(x.activeFrom).getTime()) : [];
        setAnnouncements(sorted);
        setDepartments(d);
    } catch(e) {
        console.error("Failed to load data", e);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e: any) {
    e.preventDefault();
    const f = e.target;
    
    const payload = {
        title: f.title.value,
        message: f.message.value,
        audience: f.audience.value,
        departmentId: f.departmentId.value || null,
        priority: f.priority.value,
        activeFrom: f.activeFrom.value,
        activeUntil: f.activeUntil.value || null,
    };

    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsCreatorOpen(false);
    loadData();
  }

  async function deleteAnnouncement(id: string) {
    if (!confirm("Are you sure you want to delete this broadcast?")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    loadData();
  }

  // --- FILTER & PAGINATION ---
  const filteredAnnouncements = announcements.filter(a => 
      a.title.toLowerCase().includes(search.toLowerCase()) || 
      a.message.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const paginatedAnnouncements = filteredAnnouncements.slice(
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
               <Megaphone size={16} className="text-rose-500 animate-pulse" />
               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Broadcast Center</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Announcements</h1>
            <p className="text-neutral-400 text-sm">Deploy urgent alerts and campus-wide notifications.</p>
         </div>
         
         <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input 
                    placeholder="Search Broadcasts..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder:text-neutral-600"
                />
             </div>

             <button 
                  onClick={() => setIsCreatorOpen(true)}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 border border-white/10 whitespace-nowrap"
             >
                  <Plus size={18} /> New Broadcast
             </button>
         </div>
      </div>

      {/* --- ANNOUNCEMENTS CONTENT --- */}
      {loading ? (
           <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 size={32} className="text-rose-500 animate-spin mb-4" />
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Scanning Frequencies...</p>
          </div>
      ) : (
          <>
            {/* Logic Change: Render LIST if items exist, otherwise Render EMPTY STATE immediately */}
            {filteredAnnouncements.length > 0 ? (
                <div className="space-y-4 min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {paginatedAnnouncements.map((announcement) => {
                            const dept = departments.find(d => d.id === announcement.departmentId);
                            const isExpired = announcement.activeUntil && new Date(announcement.activeUntil) < new Date();

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    key={announcement.id}
                                    className={`group relative p-6 rounded-2xl border transition-all flex flex-col md:flex-row gap-6 items-start
                                        ${isExpired 
                                            ? "bg-neutral-950/40 border-white/5 opacity-60" 
                                            : "bg-neutral-900/40 border-white/10 hover:bg-neutral-800/60 hover:border-rose-500/20 backdrop-blur-sm"}
                                    `}
                                >
                                     {/* Icon Column */}
                                     <div className="flex-shrink-0 pt-1">
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${isExpired ? 'bg-neutral-900 border-white/5 text-neutral-600' : 'bg-gradient-to-br from-neutral-800 to-neutral-900 border-white/10 text-rose-500 shadow-inner'}`}>
                                            <Megaphone size={20} />
                                        </div>
                                     </div>

                                     {/* Content */}
                                     <div className="flex-1 min-w-0 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className={`text-lg font-bold truncate ${isExpired ? 'text-neutral-500' : 'text-white'}`}>{announcement.title}</h3>
                                            
                                            <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1 ${getPriorityStyle(announcement.priority)}`}>
                                                {announcement.priority === "URGENT" && <AlertTriangle size={10} />}
                                                {announcement.priority}
                                            </div>

                                            <div className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-neutral-400 text-[9px] font-bold uppercase flex items-center gap-1">
                                                {getAudienceIcon(announcement.audience)}
                                                {announcement.audience.replace("_", " ")}
                                                {dept && ` (${dept.code})`}
                                            </div>

                                            {isExpired && (
                                                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border bg-neutral-950 text-neutral-600 border-neutral-800">
                                                    Expired
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-sm text-neutral-400 leading-relaxed max-w-4xl">{announcement.message}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-6 text-[10px] text-neutral-500 font-mono pt-3 border-t border-white/5 mt-1">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={12} className="text-neutral-600" /> 
                                                Live From: {new Date(announcement.activeFrom).toLocaleDateString()}
                                            </span>
                                            {announcement.activeUntil && (
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={12} className="text-neutral-600" /> 
                                                    Until: {new Date(announcement.activeUntil).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                     </div>

                                     {/* Actions */}
                                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity self-start md:self-center">
                                         <button 
                                             onClick={() => deleteAnnouncement(announcement.id)}
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
                </div>
            ) : (
                /* Empty State - Now replaces the list instead of sitting below it */
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                        <Filter size={24} />
                    </div>
                    <p className="text-neutral-400 font-medium">No broadcasts found</p>
                    <p className="text-neutral-600 text-xs mt-1">Try adjusting your filters or search terms</p>
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
                      className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
                  >
                      <form onSubmit={handleCreate}>
                          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-rose-500/5 to-transparent">
                              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  Initialize Broadcast
                              </h2>
                              <button type="button" onClick={() => setIsCreatorOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                  <X size={20} />
                              </button>
                          </div>

                          <div className="p-6 space-y-5">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Broadcast Title</label>
                                  <input 
                                      name="title"
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all"
                                      placeholder="e.g. Urgent Campus Alert"
                                      required
                                  />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Target Audience</label>
                                      <select 
                                          name="audience"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                                          required
                                      >
                                          <option value="ALL">All Students</option>
                                          <option value="HOSTELLERS_ONLY">Hostellers Only</option>
                                          <option value="DEPARTMENT_ONLY">Department Specific</option>
                                      </select>
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Department (Optional)</label>
                                      <select 
                                          name="departmentId"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                                      >
                                          <option value="">-- None --</option>
                                          {departments.map(d => (
                                              <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
                                          ))}
                                      </select>
                                  </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Priority</label>
                                      <select 
                                          name="priority"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                                          required
                                      >
                                          <option value="NORMAL">Normal</option>
                                          <option value="IMPORTANT">Important</option>
                                          <option value="URGENT">Urgent</option>
                                      </select>
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active From</label>
                                      <input 
                                          type="date"
                                          name="activeFrom"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 [color-scheme:dark]"
                                          required
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Until (Optional)</label>
                                      <input 
                                          type="date"
                                          name="activeUntil"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 [color-scheme:dark]"
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Message Body</label>
                                  <textarea 
                                      name="message"
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all resize-none h-24"
                                      placeholder="Content of the announcement..."
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
                                  <Send size={16} /> Deploy Broadcast
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