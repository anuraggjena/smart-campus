"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/policies", label: "Policies" },
  { href: "/admin/campus-services", label: "Campus Services" },
  { href: "/admin/procedures", label: "Procedures" },
  { href: "/admin/hods", label: "HOD Management" },
  { href: "/admin/offices", label: "Offices" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="w-64 h-screen flex flex-col border-r bg-white">
      <div className="p-6 text-xl font-semibold border-b">
        Smart Campus
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-4">
        {links.map(link => (
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

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
