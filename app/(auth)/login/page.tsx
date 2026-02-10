"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Command, CheckCircle2, Quote, EyeOff, Eye, Shield, Sparkles, Bolt, BoltIcon, Lightbulb, Zap } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Authentication Failed");

      const meRes = await fetch("/api/auth/me", { credentials: "include" });
      const user = await meRes.json();

      // Smooth transition delay
      setTimeout(() => {
        if (user.role === "ADMIN") router.push("/admin/dashboard");
        else if (user.role === "HOD") router.push("/hod/dashboard");
        else router.push("/student/dashboard");
      }, 800); 

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    // Main Container - Deep Space Base Color
    <div className="min-h-screen w-full flex bg-neutral-950 selection:bg-indigo-500/30">
      
      {/* ======================= */}
      {/* LEFT SIDE: LOGIN FORM   */}
      {/* ======================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10">
        
        {/* Brand Header */}
        <Link href="/" className="absolute top-10 left-10 md:left-24 flex items-center gap-2 group cursor-pointer">
          <Image src="/logo.svg" width={25} height={25} alt="Syntra Academy Logo" />
          <span className="text-lg font-bold tracking-tighter text-white">Syntra<span className="text-indigo-500">Academy</span></span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto mt-20 lg:mt-0"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Welcome back</h1>
          <p className="text-neutral-400 mb-8">
            Enter your credentials to access the <span className="text-indigo-400 font-medium">Intelligence Engine</span>.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-300 uppercase tracking-wider">Email Identity</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-neutral-600"
                placeholder="id@campus.edu"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-neutral-300 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} // Dynamic Type
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-3.5 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all placeholder:text-neutral-600"
                  placeholder="••••••••"
                />
                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black hover:bg-neutral-200 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-neutral-500">
            Secured by Syntra Identity Protocol v1.0
          </div>
        </motion.div>
      </div>

      {/* ======================= */}
      {/* RIGHT SIDE: THE QUOTE   */}
      {/* ======================= */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden border-l border-white/5">
        
        {/* --- DEEP SPACE BACKGROUND --- */}
        <div className="absolute inset-0 bg-linear-to-br from-neutral-950 via-neutral-950 to-indigo-950/20" />
        <div className="absolute top-0 right-0 w-200 h-200 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.15),transparent_70%)] blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent_70%)] blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />

        {/* --- THE PHILOSOPHY CARD --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-lg w-full px-6"
        >
          {/* Top Tag */}
          <div className="flex justify-center mb-8">
             <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-indigo-300 uppercase tracking-[0.2em] backdrop-blur-xl flex items-center gap-2 shadow-2xl">
               <Zap size={12} className="text-indigo-400" /> Smart Campus
             </div>
          </div>

          {/* The Glass Container */}
          <div className="rounded-[3rem] border border-white/10 bg-white/2 backdrop-blur-md p-12 text-center relative overflow-hidden group">
            
            {/* Background Shimmer (Subtle) */}
            <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-500" />
            
            {/* Quote Icon */}
            <div className="mb-8 flex justify-center opacity-50">
               <Quote size={48} className="text-white fill-white/10" />
            </div>
            
            {/* The Quote Text */}
            <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-8 tracking-tight">
              "Built around how students  <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">ask, think, and need</span> — not how systems are <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-400">structured</span>."
            </h2>

            {/* Author */}
            <div className="flex flex-col items-center">
              <div className="h-px w-12 bg-white/20 mb-4" />
              <div className="text-white font-bold tracking-wide uppercase text-sm">Anurag Jena</div>
              <div className="text-neutral-500 text-xs mt-1 font-medium tracking-widest">Creator, Smart Campus Intelligence Engine</div>
            </div>

          </div>

          {/* Bottom "Powered By" Text */}
          <div className="mt-8 flex justify-center items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest opacity-60">
            <Shield size={10} />
            <span>Operational Intelligence</span>
          </div>

        </motion.div>
      </div>

    </div>
  );
}