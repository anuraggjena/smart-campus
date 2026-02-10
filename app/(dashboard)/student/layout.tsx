import { ReactNode } from "react";
// Make sure this path matches where you saved the sidebar component
import { StudentSidebar } from "@/components/layout/StudentSidebar"; 

export default function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden selection:bg-indigo-500/30">
      
      {/* 1. The Neural Sidebar */}
      <StudentSidebar />
      
      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-track-neutral-950 scrollbar-thumb-neutral-800">
        
        {/* Optional: Global Background Texture for all student pages */}
        <div className="fixed inset-0 pointer-events-none z-[-1]">
             <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
        </div>

        {children}
      </main>
    </div>
  );
}