"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/services", label: "Campus Services" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/policies", label: "Policies" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

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

      <div className="h-16 bg-white border-b flex items-center justify-end px-6">
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
