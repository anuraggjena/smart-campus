"use client";
import React from "react";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-white/10 py-8 relative overflow-hidden">
      
      {/* Subtle Bottom Glow to match the Hero */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-125 h-50 bg-indigo-600/10 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left: Copyright & Identity */}
        <div className="text-neutral-500 text-sm font-medium flex items-center gap-2">
            <span>© 2026</span>
            <span className="text-white font-semibold tracking-tight">Syntra Academy</span>
            <span className="hidden md:inline text-neutral-700">|</span>
            <span className="opacity-80">All Rights Reserved.</span>
        </div>

        {/* Right: The "Attractive" Creator Credit */}
        <div className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/3 border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm cursor-default">
            <span className="text-neutral-400 text-sm font-medium">Built with</span>
            
            {/* Pulsing Heart Animation */}
            <div className="relative">
                <div className="absolute inset-0 bg-rose-500 blur-sm opacity-50 animate-pulse" />
                <Heart size={14} className="text-rose-500 fill-rose-500 relative z-10 animate-pulse" />
            </div>
            
            <span className="text-neutral-400 text-sm font-medium">by</span>
            
            {/* Gradient Text Name */}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-cyan-400 to-indigo-400 font-bold tracking-wide bg-size-[200%_auto] animate-[shimmer_3s_linear_infinite]">
                Anurag
            </span>
        </div>

      </div>
    </footer>
  );
}