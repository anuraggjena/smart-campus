import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar"; 

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden selection:bg-rose-500/30">
      
      {/* --- SYSTEM CORE ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          {/* Technical Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />
          
          {/* PRIMARY GLOW: Shifted to Top-Right to avoid Sidebar clash */}
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-rose-900/10 blur-[120px] rounded-full mix-blend-screen" />
          
          {/* SECONDARY GLOW: Subtle bottom wash */}
          <div className="absolute bottom-[-20%] left-[10%] w-[600px] h-[600px] bg-red-900/5 blur-[150px] rounded-full mix-blend-screen" />
          
          {/* Vignette to keep edges focused */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-neutral-950/20" />
      </div>

      {/* --- SIDEBAR --- */}
      <AdminSidebar />
      
      {/* --- MAIN COMMAND AREA --- */}
      <main className="flex-1 overflow-y-auto relative z-10 scrollbar-thin scrollbar-track-neutral-950 scrollbar-thumb-white/10 hover:scrollbar-thumb-rose-500/20">
        {children}
      </main>
    </div>
  );
}