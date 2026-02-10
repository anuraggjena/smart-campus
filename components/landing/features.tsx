"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Bot, BookOpen, Layers, Search, LucideIcon, Cpu, ShieldCheck } from "lucide-react";

// --- TYPES ---
interface FeatureCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  className?: string;
  highlight?: string;
  gradient: string;
}

// --- SUB-COMPONENT: SPOTLIGHT CARD ---
// This creates the "cursor following glow" effect
const SpotlightCard = ({ title, desc, icon: Icon, className = "", highlight, gradient }: FeatureCardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    position.x.set(e.clientX - rect.left);
    position.y.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative rounded-3xl border border-neutral-800 bg-neutral-900/50 overflow-hidden group ${className}`}
    >
      {/* The Moving Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${position.x}px ${position.y}px,
              rgba(255,255,255,0.1),
              transparent 40%
            )
          `,
        }}
      />
      
      {/* Inner Content Layer */}
      <div className="relative h-full p-8 flex flex-col z-10">
        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-500`}>
          <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
            <Icon size={24} className="text-white" />
          </div>
        </div>

        {highlight && (
          <div className="flex items-center gap-2 mb-3">
             <div className={`h-1.5 w-1.5 rounded-full bg-linear-to-r ${gradient}`} />
             <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 font-mono">{highlight}</span>
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
      </div>

      {/* Background Decor */}
      <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none">
         <Icon size={180} strokeWidth={0.5} />
      </div>
    </motion.div>
  );
};

// --- MAIN SECTION ---
export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-neutral-950 relative overflow-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Cpu size={14} /> System Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            The Intelligence Layer for <br /> 
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
              Modern Campus Governance
            </span>
          </h2>
          <p className="text-neutral-400 text-lg">
            Syntra Academy replaces static portals with a living, breathing feedback loop. 
            Every query refines the institution's clarity.
          </p>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* 1. RAG ENGINE (Tall Card - Span 2 Rows) */}
          <div className="md:row-span-2 relative rounded-3xl border border-neutral-800 bg-neutral-900/50 p-8 overflow-hidden group">
             <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             
             <div className="relative z-10 h-full flex flex-col">
               <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20">
                 <Bot size={32} className="text-white" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Institutional RAG</h3>
               <p className="text-neutral-400 leading-relaxed mb-8">
                 A custom retrieval architecture that maps natural language to exact policy codes. Zero hallucinations, 100% institutional accuracy.
               </p>

               {/* The "Live Terminal" Visual */}
               <div className="mt-auto w-full bg-black/80 rounded-xl border border-neutral-800 p-4 font-mono text-xs shadow-2xl">
                 <div className="flex items-center gap-2 mb-3 border-b border-neutral-800 pb-2">
                   <div className="w-2 h-2 rounded-full bg-red-500" />
                   <div className="w-2 h-2 rounded-full bg-yellow-500" />
                   <div className="w-2 h-2 rounded-full bg-green-500" />
                   <span className="ml-auto text-neutral-600">bash</span>
                 </div>
                 <div className="space-y-2">
                   <p className="text-neutral-500">$ query --input "Hostel fees?"</p>
                   <p className="text-indigo-400">→ Identifying Intent: [FEES_QUERY]</p>
                   <p className="text-emerald-400">→ Match Found: Policy H-102 (99%)</p>
                   <p className="text-emerald-400">→ Retrieving Procedure: PAYMENT-01</p>
                 </div>
               </div>
             </div>
          </div>

          {/* 2. POLICY VAULT */}
          <SpotlightCard
            title="Policy Vault"
            desc="Centralized, version-controlled repository for all institutional rules."
            icon={BookOpen}
            gradient="from-blue-500 to-cyan-500"
            highlight="Single Source of Truth"
          />

          {/* 3. INTERACTION LOGS */}
          <SpotlightCard
            title="Clarity Logging"
            desc="Every interaction is tracked to calculate the Process Clarity Index (PCI)."
            icon={Search}
            gradient="from-emerald-500 to-teal-500"
            highlight="Analytics Feed"
          />

          {/* 4. GUIDED FLOWS */}
          <SpotlightCard
            title="Guided Flows"
            desc="Step-by-step interactive checklists for complex campus procedures."
            icon={Layers}
            gradient="from-orange-500 to-red-500"
            highlight="Actionable Steps"
          />

          {/* 5. ROLE GOVERNANCE */}
          <SpotlightCard
            title="Role Governance"
            desc="Strict RBAC ensures students, HODs, and Admins see only what they need."
            icon={ShieldCheck}
            gradient="from-purple-500 to-pink-500"
            highlight="Security First"
          />

        </div>
      </div>
    </section>
  );
}