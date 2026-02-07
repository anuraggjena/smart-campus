"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const links = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/assistant", label: "AI Assistant" },
  { href: "/student/services", label: "Campus Services" },
  { href: "/student/procedures", label: "Procedures" },
  { href: "/student/announcements", label: "Announcements" },
  { href: "/student/feedback", label: "Feedback" },
  { href: "/student/policies", label: "Policies" },
  { href: "/student/events", label: "Academic Events" },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm relative">
      {/* Top */}
      <div className="p-6 text-xl font-semibold">
        Smart Campus
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1 px-4 pb-24">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-md text-sm ${
              pathname.startsWith(link.href)
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Absolute bottom logout */}
      <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white">
        <Button variant="outline" className="w-full" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
