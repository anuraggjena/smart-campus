import { ReactNode } from "react";
import { StudentSidebar } from "@/components/layout/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-100">
      <StudentSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
