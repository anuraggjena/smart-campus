"use client";
import React from "react";
import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, TrendingUp, Zap } from "lucide-react";

export default function PCI() {
  return (
    <section id="pci" className="py-32 px-6 bg-neutral-950 relative overflow-hidden border-t border-white/5">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left: The Pitch */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Activity size={14} /> The Proprietary Metric
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6 leading-[1.1]">
            Quantify Confusion. <br />
            <span className="text-emerald-400">Optimize Clarity.</span>
          </h2>
          
          <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
            Other platforms just answer questions. Syntra Academy measures how hard it was to get that answer.
            Our <strong>Process Clarity Index (PCI)</strong> identifies friction points in your institutional policies before they become support tickets.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-neutral-900 p-2 rounded-lg border border-white/10 h-fit">
                <AlertCircle className="text-rose-400" size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Follow-Up Penalty</h4>
                <p className="text-neutral-500 text-sm">If a student has to ask "What do you mean?", the policy score drops.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-1 bg-neutral-900 p-2 rounded-lg border border-white/10 h-fit">
                <Zap className="text-yellow-400" size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Confidence Scoring</h4>
                <p className="text-neutral-500 text-sm">Low-confidence AI matches flag ambiguous procedures automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Visual Gauge (Mock Dashboard) */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-emerald-500/20 blur-[100px] rounded-full -z-10" />
          
          <div className="rounded-[2.5rem] bg-neutral-900/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-1">Live Campus Clarity</h3>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-emerald-500 text-xs font-mono">SYSTEM ACTIVE</span>
                </div>
              </div>
              <TrendingUp className="text-neutral-600" />
            </div>

            {/* The Gauge */}
            <div className="flex flex-col items-center justify-center relative mb-10">
              <svg className="w-64 h-64 transform -rotate-90">
                {/* Track */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-neutral-800"
                />
                {/* Progress */}
                <motion.circle
                  initial={{ strokeDasharray: "0 1000" }}
                  whileInView={{ strokeDasharray: "650 1000" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-emerald-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-6xl font-black text-white tracking-tighter"
                >
                  92.4
                </motion.span>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mt-2">EXCELLENT</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">Policies Audited</div>
                <div className="text-xl font-bold text-white">1,248</div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-neutral-500 text-[10px] uppercase font-bold mb-1">Penalty Events</div>
                <div className="text-xl font-bold text-rose-400">- 7.6%</div>
              </div>
            </div>

          </div>

          {/* Floating 'Success' Toast */}
          <motion.div 
            initial={{ opacity: 0, y: 20, x: 20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -right-8 top-12 p-4 rounded-xl bg-neutral-800 border border-emerald-500/30 shadow-xl flex items-center gap-3"
          >
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
               <CheckCircle2 size={18} />
            </div>
            <div>
               <div className="text-xs font-bold text-white">Action Recommended</div>
               <div className="text-[10px] text-neutral-400">Update Policy Exam-04</div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}