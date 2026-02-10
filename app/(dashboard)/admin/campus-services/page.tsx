"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Search, 
  Settings, 
  Truck, 
  Home, 
  BookOpen, 
  CreditCard, 
  GraduationCap, 
  Globe, 
  Users, 
  Eye, 
  EyeOff, 
  X,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from "lucide-react";

// --- TYPES ---
interface Service {
  id: string;
  name: string;
  description: string;
  category: "HOSTEL" | "TRANSPORT" | "FEES" | "SCHOLARSHIP" | "LIBRARY" | "GENERAL";
  owningOffice: string;
  visibility: "ALL_STUDENTS" | "HOSTELLERS_ONLY";
}

interface Office {
  id: string;
  code: string;
  name: string;
}

// --- VISUAL HELPERS ---
const getCategoryStyle = (cat: string) => {
    switch(cat) {
        case "HOSTEL": return { icon: Home, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" };
        case "TRANSPORT": return { icon: Truck, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" };
        case "FEES": return { icon: CreditCard, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
        case "SCHOLARSHIP": return { icon: GraduationCap, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
        case "LIBRARY": return { icon: BookOpen, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
        default: return { icon: Globe, color: "text-neutral-400 bg-neutral-500/10 border-neutral-500/20" };
    }
};

export default function CampusServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  async function load() {
    setLoading(true);
    try {
        const [s, o] = await Promise.all([
            fetch("/api/admin/campus-services").then(r => r.json()),
            fetch("/api/offices").then(r => r.json())
        ]);
        setServices(s);
        setOffices(o);
    } catch(e) {
        console.error("Failed to load data", e);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createService(e: any) {
    e.preventDefault();
    const f = e.target;
    
    // Construct payload manually to avoid 'any' issues or complex form data handling
    const payload = {
       name: f.name.value,
       description: f.description.value,
       category: f.category.value,
       owningOffice: f.office.value,
       visibility: f.visibility.value,
    };

    await fetch("/api/admin/campus-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsCreatorOpen(false);
    f.reset();
    load();
  }

  async function deleteService(id: string) {
    if (!confirm("Are you sure you want to dismantle this service node?")) return;

    await fetch(`/api/admin/campus-services/${id}`, {
      method: "DELETE",
    });

    load();
  }

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice(
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
               <Briefcase size={16} className="text-rose-500 animate-pulse" />
               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">Infrastructure Control</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Campus Services</h1>
            <p className="text-neutral-400 text-sm">Manage student amenities, transport nodes, and facility access.</p>
         </div>
         
         <div className="flex items-center gap-4">
              <div className="hidden md:block text-right mr-4 border-r border-white/10 pr-6">
                 <div className="text-2xl font-bold text-white">{services.length}</div>
                 <div className="text-[10px] text-neutral-500 uppercase tracking-widest">Active Services</div>
             </div>

             <button 
                  onClick={() => setIsCreatorOpen(true)}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 border border-white/10"
             >
                  <Plus size={18} /> Deploy Service
             </button>
         </div>
      </div>

      {/* --- SERVICE GRID --- */}
      {loading ? (
           <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 size={32} className="text-rose-500 animate-spin mb-4" />
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Loading Infrastructure...</p>
          </div>
      ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {paginatedServices.map((service) => {
                        const style = getCategoryStyle(service.category);
                        const office = offices.find(o => o.id === service.owningOffice);

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={service.id}
                                className="group relative p-6 rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-rose-500/20 transition-all flex flex-col justify-between backdrop-blur-sm"
                            >
                                 <div className="mb-4">
                                     <div className="flex justify-between items-start mb-4">
                                         <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${style.color}`}>
                                             <style.icon size={20} />
                                         </div>
                                         <div className="flex gap-2">
                                             {service.visibility === "HOSTELLERS_ONLY" ? (
                                                 <div className="px-2 py-1 rounded border border-orange-500/20 bg-orange-500/10 text-orange-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                                     <Home size={10} /> Hostellers
                                                 </div>
                                             ) : (
                                                 <div className="px-2 py-1 rounded border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                                     <Users size={10} /> All
                                                 </div>
                                             )}
                                         </div>
                                     </div>

                                     <h3 className="text-lg font-bold text-white mb-2 group-hover:text-rose-200 transition-colors">{service.name}</h3>
                                     <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">{service.description}</p>
                                 </div>

                                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                     <div className="text-[10px] font-mono text-neutral-500">
                                         Owned by <span className="text-neutral-300 font-bold">{office ? office.code : "UNKNOWN"}</span>
                                     </div>
                                     
                                     <button 
                                         onClick={() => deleteService(service.id)}
                                         className="p-2 rounded-lg bg-neutral-800 border border-white/5 hover:bg-rose-950 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                     >
                                         <Trash2 size={14} />
                                     </button>
                                 </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {services.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                        <Settings size={24} />
                    </div>
                    <p className="text-neutral-400 font-medium">No services deployed</p>
                    <p className="text-neutral-600 text-xs mt-1">Initialize a new service module to begin</p>
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
                      <form onSubmit={createService}>
                          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-rose-500/5 to-transparent">
                              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  Deploy New Service
                              </h2>
                              <button type="button" onClick={() => setIsCreatorOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                  <X size={20} />
                              </button>
                          </div>

                          <div className="p-6 space-y-5">
                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Service Name</label>
                                  <input 
                                      name="name"
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all"
                                      placeholder="e.g. Campus Shuttle Bus"
                                      required
                                  />
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Description</label>
                                  <textarea 
                                      name="description"
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all resize-none h-24"
                                      placeholder="Define service utility..."
                                      required
                                  />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Category</label>
                                      <select 
                                          name="category"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                                      >
                                          <option value="GENERAL">General</option>
                                          <option value="HOSTEL">Hostel</option>
                                          <option value="TRANSPORT">Transport</option>
                                          <option value="FEES">Fees</option>
                                          <option value="SCHOLARSHIP">Scholarship</option>
                                          <option value="LIBRARY">Library</option>
                                      </select>
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Visibility</label>
                                      <select 
                                          name="visibility"
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                                      >
                                          <option value="ALL_STUDENTS">All Students</option>
                                          <option value="HOSTELLERS_ONLY">Hostellers Only</option>
                                      </select>
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Owning Office</label>
                                  <select 
                                      name="office"
                                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                                  >
                                      {offices.map(o => (
                                          <option key={o.id} value={o.id}>{o.code} — {o.name}</option>
                                      ))}
                                  </select>
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
                                  <Save size={16} /> Initialize
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