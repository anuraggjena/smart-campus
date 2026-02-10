"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Briefcase, 
  Plus, 
  Trash2, 
  Search, 
  Save, 
  Loader2, 
  Database,
  Hash,
  Type,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// --- TYPES ---
type Entity = {
  id: string;
  code: string;
  name: string;
};

export default function AdminMasterDataPage() {
  const [activeTab, setActiveTab] = useState<"OFFICES" | "DEPARTMENTS">("OFFICES");
  const [offices, setOffices] = useState<Entity[]>([]);
  const [departments, setDepartments] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  async function loadData() {
    setLoading(true);
    try {
        const [o, d] = await Promise.all([
            fetch("/api/admin/offices").then(r => r.json()),
            fetch("/api/admin/departments").then(r => r.json())
        ]);
        setOffices(o);
        setDepartments(d);
    } catch(e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // --- ACTIONS ---
  async function handleCreate(e: any) {
    e.preventDefault();
    setSubmitting(true);
    const f = e.target;
    const endpoint = activeTab === "OFFICES" ? "/api/admin/offices" : "/api/admin/departments";

    try {
        await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: f.id.value,
                code: f.code.value,
                name: f.name.value,
            }),
        });
        f.reset();
        await loadData();
    } catch(e) {
        console.error(e);
    } finally {
        setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(`Delete this ${activeTab === "OFFICES" ? "Office" : "Department"}?`)) return;
    const endpoint = activeTab === "OFFICES" ? `/api/admin/offices/${id}` : `/api/admin/departments/${id}`;
    
    await fetch(endpoint, { method: "DELETE" });
    loadData();
  }

  // --- FILTERING & PAGINATION ---
  const currentList = activeTab === "OFFICES" ? offices : departments;
  
  const filteredList = currentList.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  // Reset page when tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  return (
    <div className="w-full relative p-6 md:p-10 space-y-6 min-h-screen text-white">
      
      {/* --- HEADER & TABS --- */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <Database size={16} className="text-rose-500 animate-pulse" />
               <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">System Configuration</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Master Data Registry</h1>
         </div>

         {/* Tab Switcher */}
         <div className="flex bg-neutral-900 p-1 rounded-xl border border-white/10">
             <button
                onClick={() => setActiveTab("OFFICES")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "OFFICES" 
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-900/50" 
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                }`}
             >
                <Briefcase size={14} /> Offices
             </button>
             <button
                onClick={() => setActiveTab("DEPARTMENTS")}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "DEPARTMENTS" 
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-900/50" 
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                }`}
             >
                <Building2 size={14} /> Departments
             </button>
         </div>
      </div>

      {/* --- MAIN GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: LIST VIEW */}
          <div className="lg:col-span-2 flex flex-col gap-4 min-h-[500px]">
              {/* Search */}
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                  <input 
                      placeholder={`Search ${activeTab.toLowerCase()}...`}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder:text-neutral-600"
                  />
              </div>

              {/* List Container */}
              <div className="flex-1 flex flex-col justify-between bg-neutral-900/20 rounded-2xl border border-white/5 p-2">
                  <div className="space-y-2">
                      {loading ? (
                          <div className="h-64 flex flex-col items-center justify-center text-neutral-500">
                              <Loader2 size={32} className="animate-spin mb-2 text-rose-500" />
                              <span className="text-xs font-mono">Fetching Records...</span>
                          </div>
                      ) : paginatedList.length === 0 ? (
                          <div className="h-64 flex flex-col items-center justify-center text-neutral-600">
                              <Database size={32} className="mb-2 opacity-20" />
                              <span className="text-sm">No records found.</span>
                          </div>
                      ) : (
                          <AnimatePresence mode="popLayout">
                              {paginatedList.map((item) => (
                                  <motion.div
                                      layout
                                      initial={{ opacity: 0, scale: 0.98 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.98 }}
                                      key={item.id}
                                      className="group flex items-center justify-between p-4 rounded-xl bg-neutral-900/60 border border-white/5 hover:border-rose-500/30 transition-all"
                                  >
                                      <div>
                                          <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                                                  {item.code}
                                              </span>
                                              <span className="text-xs text-neutral-600 font-mono">#{item.id}</span>
                                          </div>
                                          <h3 className="text-sm font-bold text-white">{item.name}</h3>
                                      </div>
                                      <button 
                                          onClick={() => handleDelete(item.id)}
                                          className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                      >
                                          <Trash2 size={16} />
                                      </button>
                                  </motion.div>
                              ))}
                          </AnimatePresence>
                      )}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-2 py-4 mt-2 border-t border-white/5">
                        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
                            Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
                        </span>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg bg-neutral-800 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 transition-all"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg bg-neutral-800 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-neutral-700 transition-all"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                  )}
              </div>
          </div>

          {/* RIGHT: CREATION PANEL */}
          <div className="lg:col-span-1">
              <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-neutral-900 border border-white/10 rounded-2xl p-6 sticky top-6 shadow-2xl shadow-black/50"
              >
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-600 to-rose-800 flex items-center justify-center text-white shadow-lg">
                          <Plus size={18} />
                      </div>
                      <div>
                          <h2 className="text-sm font-bold text-white">Add New {activeTab === "OFFICES" ? "Office" : "Department"}</h2>
                          <p className="text-[10px] text-neutral-500">Define a new entity in the system.</p>
                      </div>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-4">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                              <Hash size={10} /> Unique ID
                          </label>
                          <input 
                              name="id" 
                              placeholder={activeTab === "OFFICES" ? "acc-office" : "cse-dept"} 
                              required 
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500/50 font-mono"
                          />
                      </div>

                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                              <Type size={10} /> Short Code
                          </label>
                          <input 
                              name="code" 
                              placeholder={activeTab === "OFFICES" ? "ACC" : "CSE"} 
                              required 
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500/50 font-mono uppercase"
                          />
                      </div>

                      <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                              <Database size={10} /> Full Name
                          </label>
                          <input 
                              name="name" 
                              placeholder={activeTab === "OFFICES" ? "Accounts Section" : "Computer Science"} 
                              required 
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500/50"
                          />
                      </div>

                      <button 
                          type="submit" 
                          disabled={submitting}
                          className="w-full mt-4 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          Save Record
                      </button>
                  </form>
              </motion.div>
          </div>

      </div>
    </div>
  );
}