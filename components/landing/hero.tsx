"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { BackgroundBeams } from "@/components/ui/background-beams"; // Ensure this path is correct
import Link from "next/link";

export function Hero() {
  return (
    <section id="hero" className="relative h-180 md:h-screen w-full bg-neutral-950 flex flex-col items-center justify-center antialiased overflow-hidden pt-20">
      
      {/* Content Container - z-10 puts it above the background */}
      <div className="max-w-5xl mx-auto p-4 relative z-10 text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-10"
        >
          <Zap size={16} /> THE NEXT-GEN CAMPUS OS
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-neutral-400 tracking-tight mb-8 leading-[1.1]"
        >
          Smart Campus and <br />Student Intelligence System.
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-md md:text-lg text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Syntra Academy replaces static portals with an intelligent feedback loop. 
          Map natural language to exact institutional truth and quantify administrative clarity in real-time.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          {/* Primary Button with Glowing Gradient Border */}
          <Link href="/register">
            <button className="relative inline-flex h-14 overflow-hidden rounded-full p-0.5 group">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-2 text-base font-medium text-white backdrop-blur-3xl gap-2 transition-transform group-hover:scale-[0.98]">
                Get Started <ArrowRight size={20} />
              </span>
            </button>
          </Link>
        </motion.div>
      </div>

      {/* The 3D Animated Background Beams */}
      <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0" />
    </section>
  );
}