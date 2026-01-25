"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/assistant", label: "AI Assistant" },
  { href: "/student/services", label: "Campus Services" },
  { href: "/student/procedures", label: "Procedures" },
  { href: "/student/announcements", label: "Announcements" },
  { href: "/student/feedback", label: "Feedback" },
  { href: "/student/policies", label: "Policies" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r shadow-sm">
      <div className="p-6 text-xl font-semibold">
        Smart Campus
      </div>

      <nav className="flex flex-col gap-1 px-4">
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
    </div>
  );
}
