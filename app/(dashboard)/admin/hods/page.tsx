"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Mail, 
  Building2, 
  Edit2, 
  Trash2, 
  Loader2, 
  X, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  User,
  Lock,
  Filter
} from "lucide-react";

// --- TYPES ---
type Department = {
  id: string;
  code: string;
  name: string;
};

type HodUser = {
  id: string;
  name: string;
  email: string;
  departmentId: string; // Needed for edit binding
  departmentName: string;
};

// --- VISUAL HELPERS ---
const getAvatarColor = (name: string) => {
    const colors = [
        "bg-rose-600", "bg-emerald-600", "bg-amber-600", "bg-blue-600", "bg-purple-600", "bg-orange-600"
    ];
    return colors[name.length % colors.length];
};

export default function AdminHodManagementPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hods, setHods] = useState<HodUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHod, setEditingHod] = useState<HodUser | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  async function loadData() {
    setLoading(true);
    try {
        const [d, h] = await Promise.all([
            fetch("/api/admin/departments").then(r => r.json()),
            fetch("/api/admin/hods").then(r => r.json())
        ]);
        setDepartments(d);
        setHods(h);
    } catch(e) {
        console.error("Failed to load data", e);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // --- ACTIONS ---

  function openCreateModal() {
      setEditingHod(null);
      setIsModalOpen(true);
  }

  function openEditModal(hod: HodUser) {
      setEditingHod(hod);
      setIsModalOpen(true);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = e.target;
    
    const payload = {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value, // Optional in edit mode
        departmentId: form.departmentId.value,
    };

    try {
        if (editingHod) {
            // EDIT MODE: PUT
            await fetch(`/api/admin/create-hod/${editingHod.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            // CREATE MODE: POST
            await fetch("/api/admin/create-hod", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }
        
        setIsModalOpen(false);
        loadData();
    } catch (error) {
        console.error("Operation failed", error);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to remove this HOD account? This action cannot be undone.")) return;
    
    try {
        await fetch(`/api/admin/create-hod/${id}`, { method: "DELETE" });
        loadData();
    } catch (error) {
        console.error("Delete failed", error);
    }
  }

  // --- FILTER & PAGINATION ---
  const filteredHods = hods.filter(h => 
      h.name.toLowerCase().includes(search.toLowerCase()) || 
      h.departmentName.toLowerCase().includes(search.toLowerCase()) ||
      h.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHods.length / itemsPerPage);
  const paginatedHods = filteredHods.slice(
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
               <ShieldCheck size={16} className="text-rose-500 animate-pulse" />
               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Personnel Control</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">HOD Management</h1>
            <p className="text-neutral-400 text-sm">Assign leadership roles and manage departmental access privileges.</p>
         </div>
         
         <div className="flex items-center gap-4 w-full md:w-auto">
             {/* Search Bar */}
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input 
                    placeholder="Search Personnel..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder:text-neutral-600"
                />
             </div>

             <button 
                  onClick={openCreateModal}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 border border-white/10 whitespace-nowrap"
             >
                  <UserPlus size={18} /> Assign HOD
             </button>
         </div>
      </div>

      {/* --- HOD GRID --- */}
      {loading ? (
           <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 size={32} className="text-rose-500 animate-spin mb-4" />
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Loading Personnel...</p>
          </div>
      ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {paginatedHods.map((hod) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={hod.id}
                            className="group relative p-6 rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-rose-500/20 transition-all flex flex-col items-center text-center backdrop-blur-sm"
                        >
                             {/* Avatar */}
                             <div className={`h-16 w-16 rounded-full ${getAvatarColor(hod.name)} flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg ring-4 ring-neutral-900`}>
                                 {hod.name.charAt(0).toUpperCase()}
                             </div>

                             <h3 className="text-lg font-bold text-white mb-1 group-hover:text-rose-200 transition-colors">{hod.name}</h3>
                             
                             {/* Department Badge */}
                             <div className="mt-2 mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
                                 <Building2 size={12} className="text-rose-400" />
                                 <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">{hod.departmentName}</span>
                             </div>

                             <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono mb-6">
                                 <Mail size={10} /> {hod.email}
                             </div>

                             {/* Actions Overlay */}
                             <div className="w-full pt-4 border-t border-white/5 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                     onClick={() => openEditModal(hod)}
                                     className="p-2 rounded-lg bg-neutral-800 border border-white/5 hover:bg-neutral-700 hover:text-white text-neutral-400 transition-colors"
                                     title="Edit Profile"
                                 >
                                     <Edit2 size={14} />
                                 </button>
                                 <button 
                                     onClick={() => handleDelete(hod.id)}
                                     className="p-2 rounded-lg bg-neutral-800 border border-white/5 hover:bg-rose-950 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 transition-colors"
                                     title="Remove HOD"
                                 >
                                     <Trash2 size={14} />
                                 </button>
                             </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {paginatedHods.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                        <Filter size={24} />
                    </div>
                    <p className="text-neutral-400 font-medium">No personnel found</p>
                    <p className="text-neutral-600 text-xs mt-1">Try adjusting your filters or assign a new HOD</p>
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

      {/* --- CREATOR/EDITOR OVERLAY --- */}
      <AnimatePresence>
          {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsModalOpen(false)}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  />

                  <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
                  >
                      {/* Key ensures form reset on mode switch */}
                      <form onSubmit={handleSubmit} key={editingHod ? editingHod.id : 'new'}>
                          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-rose-500/5 to-transparent">
                              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  {editingHod ? "Update Personnel" : "Assign New Leadership"}
                              </h2>
                              <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                  <X size={20} />
                              </button>
                          </div>

                          <div className="p-6 space-y-5">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Full Name</label>
                                  <div className="relative">
                                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                                      <input 
                                          name="name"
                                          defaultValue={editingHod?.name}
                                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all placeholder:text-neutral-700"
                                          placeholder="e.g. Dr. Sarah Connor"
                                          required
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Email Address</label>
                                  <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                                      <input 
                                          type="email"
                                          name="email"
                                          defaultValue={editingHod?.email}
                                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all placeholder:text-neutral-700"
                                          placeholder="hod.cse@syntra.edu"
                                          required
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                      {editingHod ? "Reset Password (Optional)" : "Secure Password"}
                                  </label>
                                  <div className="relative">
                                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                                      <input 
                                          type="password"
                                          name="password"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all placeholder:text-neutral-700"
                                          placeholder={editingHod ? "Leave blank to keep current" : "••••••••"}
                                          required={!editingHod} // Required only for creation
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Assigned Department</label>
                                  <div className="relative">
                                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                                      <select 
                                          name="departmentId"
                                          defaultValue={editingHod?.departmentId}
                                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer appearance-none"
                                          required
                                      >
                                          <option value="">Select Department...</option>
                                          {departments.map(d => (
                                              <option key={d.id} value={d.id}>{d.code} — {d.name}</option>
                                          ))}
                                      </select>
                                  </div>
                              </div>
                          </div>

                          <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                              <button 
                                  type="button"
                                  onClick={() => setIsModalOpen(false)}
                                  className="px-4 py-2 rounded-lg text-sm font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider"
                              >
                                  Cancel
                              </button>
                              <button 
                                  type="submit"
                                  className="px-6 py-2 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2 uppercase tracking-wider"
                              >
                                  <Save size={16} /> {editingHod ? "Update Account" : "Create Account"}
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