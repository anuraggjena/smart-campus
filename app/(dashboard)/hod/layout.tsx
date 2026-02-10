import { ReactNode } from "react";
import { HodSidebar } from "@/components/layout/HodSidebar"; 

export default function HodLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden selection:bg-amber-500/30">
      
      {/* --- BACKGROUND ATMOSPHERE (HOD Theme) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
          
          {/* Amber Glows for Authority */}
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* --- SIDEBAR --- */}
      <HodSidebar />
      
      {/* --- MAIN COMMAND AREA --- */}
      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-track-neutral-950 scrollbar-thumb-white/10">
        {children}
      </main>
    </div>
  );
}