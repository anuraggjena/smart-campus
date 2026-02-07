import { ReactNode } from "react";
import { HodSidebar } from "@/components/layout/HodSidebar";

export default function HodLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100">
      <HodSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
    </div>
  );
}
