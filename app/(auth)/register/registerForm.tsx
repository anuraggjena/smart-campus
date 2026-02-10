"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Command, UserPlus, Building2, Home, ArrowRight, Shield, Sparkles, Check, ChevronDown, Eye, EyeOff, ScanLine, Fingerprint, Cpu, User } from "lucide-react";
import Image from "next/image";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface RegisterFormProps {
  departments: Department[];
}

export default function RegisterForm({ departments }: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [error, setError] = useState("");
  const [isHosteller, setIsHosteller] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.target;
    
    if (!departmentId) {
        setError("Please select your academic department.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          password: form.password.value,
          departmentId,
          isHosteller,
        }),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex bg-neutral-950 selection:bg-cyan-500/30 overflow-hidden">
      
      {/* ======================= */}
      {/* LEFT SIDE: INPUT FORM   */}
      {/* ======================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 px-6 md:px-12 lg:px-20 py-10">
        
        <Link href="/" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 group cursor-pointer z-50">
          <Image src="/logo.svg" width={25} height={25} alt="Syntra Academy Logo" />
          <span className="text-lg font-bold tracking-tighter text-white">Syntra<span className="text-indigo-500">Academy</span></span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto mt-12"
        >
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <UserPlus size={16} />
                </div>
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">New Student Access</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Initialize Profile</h1>
            <p className="text-neutral-400 text-sm">
                Create your digital identity to access the <span className="text-white font-medium">Smart Campus Grid</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Full Legal Name</label>
              <input 
                name="name"
                required
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all placeholder:text-neutral-600"
                placeholder="e.g. Alex Chen"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Email Identity</label>
                    <input 
                        type="email" 
                        name="email"
                        required
                        className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all placeholder:text-neutral-600"
                        placeholder="id@campus.edu"
                    />
                </div>
                
                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Secure Key</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            required
                            className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-3 pr-12 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all placeholder:text-neutral-600"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                 Academic Department
              </label>
              <div className="relative">
                <select
                    required
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all appearance-none cursor-pointer"
                >
                    <option value="" className="bg-neutral-900 text-neutral-500">Select your discipline...</option>
                    {departments?.map((d) => (
                    <option key={d.id} value={d.id} className="bg-neutral-900 text-white">
                        [{d.code}] {d.name}
                    </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={16} />
              </div>
            </div>

            <div 
                onClick={() => setIsHosteller(!isHosteller)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-300 ${isHosteller ? "bg-cyan-950/20 border-cyan-500/30" : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"}`}
            >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isHosteller ? "bg-cyan-500 border-cyan-500" : "border-neutral-600"}`}>
                    {isHosteller && <Check size={10} className="text-black" />}
                </div>
                <div className="flex-1">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Home size={12} className={isHosteller ? "text-cyan-400" : "text-neutral-500"} />
                        Campus Resident
                    </div>
                </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-rose-400 text-xs bg-rose-950/30 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white hover:bg-cyan-50 text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] group"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                  <>
                    <span>Initialize Account</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-neutral-500">
             Already initialized? <Link href="/login" className="text-cyan-400 hover:text-white underline transition-colors">Access Portal</Link>
          </div>
        </motion.div>
      </div>

      {/* ======================= */}
      {/* RIGHT SIDE: LIVE SCANNER */}
      {/* ======================= */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden border-l border-white/5 bg-neutral-900">
        
        {/* --- BRIGHTER ATMOSPHERE --- */}
        <div className="absolute -top-20 -right-20 w-150 h-150 bg-cyan-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-150 h-150 bg-violet-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />

        {/* --- THE INTERACTIVE ID CARD --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-sm w-full perspective-1000"
        >
          {/* Top Status */}
          <div className="flex justify-between items-center mb-6 px-4">
             <div className="flex items-center gap-2">
               <ScanLine size={14} className="text-cyan-400 animate-pulse" />
               <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Scanning Bio-Data</span>
             </div>
             <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-400">
                SECURE
             </div>
          </div>

          {/* THE CARD */}
          <div className="aspect-3/4 rounded-[2rem] border border-white/10 bg-white/3 backdrop-blur-xl p-8 relative overflow-hidden group shadow-2xl transition-transform hover:scale-[1.02] duration-500 flex flex-col">
            
            {/* 1. Animated Laser Scan Line */}
            <motion.div 
               animate={{ top: ["0%", "100%", "0%"] }}
               transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
               className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
            />

            {/* 2. Holographic Sheen */}
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-20 group-hover:animate-shine" />

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <Image src="/logo.svg" width={32} height={32} alt="Logo" className="opacity-90" />
                <Fingerprint size={32} className="text-white/20" />
            </div>

            {/* Avatar Section & Details */}
            <div className="flex-1 flex flex-col items-center relative z-10">
                <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-neutral-800 to-neutral-900 border border-white/10 mb-4 flex items-center justify-center shadow-inner relative overflow-hidden">
                    <User size={40} className="text-neutral-600" />
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-lg" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 rounded-br-lg" />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight mb-1">Alex Chen</h3>
                <p className="text-sm text-cyan-400 font-mono mb-6">ID: SYN-2026-4589</p>

                <div className="w-full space-y-3">
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Department</span>
                        <span className="text-xs font-bold text-white">Computer Science</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Batch</span>
                        <span className="text-xs font-bold text-white">2026</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                        <div className="text-[9px] text-cyan-300 uppercase tracking-widest mb-1">Role</div>
                        <div className="text-cyan-400 font-bold text-xs tracking-wider">STUDENT</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
                        <div className="text-[9px] text-violet-300 uppercase tracking-widest mb-1">Clearance</div>
                        <div className="text-violet-400 font-bold text-xs tracking-wider">LEVEL 1</div>
                    </div>
                </div>
            </div>

            {/* Bottom Chip */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2 opacity-50">
                <Cpu size={20} className="text-yellow-600" />
            </div>

            {/* Background Texture on Card */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          </div>

          <div className="mt-8 flex justify-center items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
            <Shield size={12} />
            <span>Encrypted via Syntra Protocol</span>
          </div>

        </motion.div>
      </div>

    </div>
  );
}