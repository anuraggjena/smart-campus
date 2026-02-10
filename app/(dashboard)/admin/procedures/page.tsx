"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit2, // Added Edit Icon
  Search, 
  Building2, 
  ListOrdered, 
  Loader2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";

// --- TYPES ---
type Procedure = {
  id: string;
  code: string;
  title: string;
  domain: string;
  stepsJson: string; // Stored as JSON string
  isActive: boolean;
  owningOffice: string;
  officeName: string;
};

type Office = {
  id: string;
  name: string;
};

// --- VISUAL HELPERS ---
const getDomainStyle = (domain: string) => {
    switch(domain) {
        case "FEES": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
        case "EXAMS": return "text-amber-400 border-amber-500/20 bg-amber-500/10";
        case "HOSTEL": return "text-orange-400 border-orange-500/20 bg-orange-500/10";
        case "ACADEMICS": return "text-blue-400 border-blue-500/20 bg-blue-500/10";
        default: return "text-neutral-400 border-neutral-500/20 bg-neutral-500/10";
    }
};

export default function AdminProceduresPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Creator/Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null);
  const [steps, setSteps] = useState<string[]>([""]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  async function loadData() {
    setLoading(true);
    try {
        const [p, o] = await Promise.all([
            fetch("/api/admin/procedures").then(r => r.json()),
            fetch("/api/admin/offices").then(r => r.json())
        ]);
        setProcedures(p);
        setOffices(o);
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
      setEditingProcedure(null);
      setSteps([""]); // Reset steps
      setIsModalOpen(true);
  }

  function openEditModal(proc: Procedure) {
      setEditingProcedure(proc);
      // Parse the JSON steps back into array for the editor
      try {
          const parsedSteps = proc.stepsJson ? JSON.parse(proc.stepsJson) : [""];
          setSteps(Array.isArray(parsedSteps) ? parsedSteps : [""]);
      } catch (e) {
          setSteps([""]);
      }
      setIsModalOpen(true);
  }

  // --- FORM HANDLERS ---
  function updateStep(index: number, value: string) {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  }

  function addStep() {
    setSteps([...steps, ""]);
  }

  function removeStep(index: number) {
      if (steps.length > 1) {
          const updated = steps.filter((_, i) => i !== index);
          setSteps(updated);
      }
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = e.target;
    
    const payload = {
        code: form.code.value,
        title: form.title.value,
        domain: form.domain.value,
        owningOffice: form.owningOffice.value,
        steps, 
    };

    try {
        if (editingProcedure) {
            // EDIT MODE
            await fetch(`/api/admin/procedures/${editingProcedure.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        } else {
            // CREATE MODE
            await fetch("/api/admin/procedures", {
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

  async function deleteProcedure(id: string) {
    if (!confirm("Are you sure you want to delete this procedure?")) return;
    await fetch(`/api/admin/procedures/${id}`, { method: "DELETE" });
    loadData();
  }

  // --- FILTER & PAGINATION ---
  const filteredProcedures = procedures.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProcedures.length / itemsPerPage);
  const paginatedProcedures = filteredProcedures.slice(
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
               <ClipboardList size={16} className="text-rose-500 animate-pulse" />
               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">SOP Control</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Standard Procedures</h1>
            <p className="text-neutral-400 text-sm">Define step-by-step workflows for institutional processes.</p>
         </div>
         
         <div className="flex items-center gap-4 w-full md:w-auto">
             {/* Search Bar */}
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                <input 
                    placeholder="Search Procedures..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder:text-neutral-600"
                />
             </div>

             <button 
                  onClick={openCreateModal}
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-rose-500/20 border border-white/10 whitespace-nowrap"
             >
                  <Plus size={18} /> Define SOP
             </button>
         </div>
      </div>

      {/* --- PROCEDURES GRID --- */}
      {loading ? (
           <div className="h-64 flex flex-col items-center justify-center">
              <Loader2 size={32} className="text-rose-500 animate-spin mb-4" />
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Loading Workflows...</p>
          </div>
      ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {paginatedProcedures.map((proc) => {
                        // Parse steps for display preview
                        let stepsList: string[] = [];
                        try {
                            stepsList = typeof proc.stepsJson === 'string' ? JSON.parse(proc.stepsJson) : proc.stepsJson;
                        } catch(e) { stepsList = [] }

                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={proc.id}
                                className="group relative p-6 rounded-2xl border border-white/10 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-rose-500/20 transition-all flex flex-col justify-between backdrop-blur-sm"
                            >
                                 <div className="mb-4">
                                     <div className="flex justify-between items-start mb-4">
                                         <div className="px-2 py-1 rounded border border-white/10 bg-white/5 text-neutral-300 text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
                                             <ListOrdered size={10} /> {proc.code}
                                         </div>
                                         <div className={`px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${getDomainStyle(proc.domain)}`}>
                                             {proc.domain}
                                         </div>
                                     </div>

                                     <h3 className="text-lg font-bold text-white mb-3 group-hover:text-rose-200 transition-colors line-clamp-2">{proc.title}</h3>
                                     
                                     {/* Steps Preview */}
                                     <div className="space-y-2 mb-4">
                                         {stepsList.slice(0, 3).map((step, idx) => (
                                             <div key={idx} className="flex items-start gap-2 text-sm text-neutral-400">
                                                 <span className="text-rose-500/50 font-mono text-[10px] mt-0.5">{idx + 1}.</span>
                                                 <span className="line-clamp-1">{step}</span>
                                             </div>
                                         ))}
                                         {stepsList.length > 3 && (
                                             <div className="text-[10px] text-neutral-600 pl-4 italic">
                                                 +{stepsList.length - 3} more steps...
                                             </div>
                                         )}
                                     </div>
                                 </div>

                                 <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                     <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                                         <Building2 size={12} />
                                         <span className="truncate max-w-[120px]">{proc.officeName}</span>
                                     </div>
                                     
                                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button 
                                             onClick={() => openEditModal(proc)}
                                             className="p-2 rounded-lg bg-neutral-800 border border-white/5 hover:bg-neutral-700 hover:text-white text-neutral-400 transition-colors"
                                             title="Edit Workflow"
                                         >
                                             <Edit2 size={14} />
                                         </button>
                                         <button 
                                             onClick={() => deleteProcedure(proc.id)}
                                             className="p-2 rounded-lg bg-neutral-800 border border-white/5 hover:bg-rose-950 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 transition-colors"
                                             title="Delete Procedure"
                                         >
                                             <Trash2 size={14} />
                                         </button>
                                     </div>
                                 </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {paginatedProcedures.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <div className="p-4 rounded-full bg-neutral-900 border border-white/5 text-neutral-600 mb-4">
                        <Filter size={24} />
                    </div>
                    <p className="text-neutral-400 font-medium">No procedures found</p>
                    <p className="text-neutral-600 text-xs mt-1">Try adjusting your search filters</p>
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
                      className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5"
                  >
                      {/* Key forces form reset when switching contexts */}
                      <form onSubmit={handleSubmit} key={editingProcedure ? editingProcedure.id : 'create-new'}>
                          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-rose-500/5 to-transparent">
                              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                  {editingProcedure ? "Update Procedure" : "Define New Procedure"}
                              </h2>
                              <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                                  <X size={20} />
                              </button>
                          </div>

                          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scroll">
                              
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Procedure Code</label>
                                      <input 
                                          name="code"
                                          defaultValue={editingProcedure?.code}
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all font-mono"
                                          placeholder="e.g. PROC-101"
                                          required
                                      />
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Title</label>
                                      <input 
                                          name="title"
                                          defaultValue={editingProcedure?.title}
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all"
                                          placeholder="e.g. Leave Application Process"
                                          required
                                      />
                                  </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Domain</label>
                                      <select 
                                          name="domain"
                                          defaultValue={editingProcedure?.domain}
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                                          required
                                      >
                                          <option value="">Select Domain</option>
                                          <option value="FEES">Fees</option>
                                          <option value="EXAMS">Exams</option>
                                          <option value="HOSTEL">Hostel</option>
                                          <option value="ACADEMICS">Academics</option>
                                          <option value="GENERAL">General</option>
                                      </select>
                                  </div>
                                  <div className="space-y-2">
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Owning Office</label>
                                      <select 
                                          name="owningOffice"
                                          defaultValue={editingProcedure?.owningOffice}
                                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 cursor-pointer"
                                          required
                                      >
                                          <option value="">Select Office</option>
                                          {offices.map(o => (
                                              <option key={o.id} value={o.id}>{o.name}</option>
                                          ))}
                                      </select>
                                  </div>
                              </div>

                              {/* --- DYNAMIC STEPS --- */}
                              <div className="space-y-3 pt-4 border-t border-white/5">
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Workflow Steps</label>
                                  {steps.map((step, i) => (
                                      <div key={i} className="flex gap-2">
                                          <div className="flex-1 relative">
                                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-neutral-500">{i + 1}.</div>
                                              <input 
                                                  value={step}
                                                  onChange={(e) => updateStep(i, e.target.value)}
                                                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500/50 focus:bg-black/60 transition-all"
                                                  placeholder={`Step Description...`}
                                                  required
                                              />
                                          </div>
                                          {steps.length > 1 && (
                                              <button 
                                                  type="button"
                                                  onClick={() => removeStep(i)}
                                                  className="p-2 rounded-lg bg-neutral-900 border border-white/10 hover:border-rose-500/50 text-neutral-400 hover:text-rose-500 transition-colors"
                                              >
                                                  <Trash2 size={14} />
                                              </button>
                                          )}
                                      </div>
                                  ))}
                                  <button 
                                      type="button"
                                      onClick={addStep}
                                      className="w-full py-2 border border-dashed border-white/10 rounded-lg text-xs font-bold text-neutral-400 hover:text-white hover:border-rose-500/30 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                  >
                                      <Plus size={12} /> Add Next Step
                                  </button>
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
                                  <Save size={16} /> 
                                  {editingProcedure ? "Update Workflow" : "Save Workflow"}
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