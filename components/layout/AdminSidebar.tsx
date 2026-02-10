"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Activity, 
  ShieldAlert, 
  FileTerminal, 
  LogOut, 
  ChevronUp, 
  Database,
  Lock
} from "lucide-react";

// --- ADMIN NAVIGATION ---
const links = [
  { href: "/admin/dashboard", label: "System Overview", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "System Health", icon: Activity },
  { href: "/admin/campus-services", label: "Campus Services", icon: FileTerminal },
  { href: "/admin/policies", label: "Policy Registry", icon: ShieldAlert },
  { href: "/admin/procedures", label: "Procedures", icon: Database },
  { href: "/admin/academics", label: "Academic Events", icon: Building2 },
  { href: "/admin/announcements", label: "Announcements", icon: FileTerminal },
  { href: "/admin/feedback", label: "Feedbacks", icon: FileTerminal },
  { href: "/admin/hods", label: "HOD Management", icon: Users },
  { href: "/admin/master", label: "O&D Creation", icon: Building2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Mock Admin Data
  const [user, setUser] = useState({ 
      name: "System Admin", 
      email: "root@syntra.edu", 
      role: "SUPER_ADMIN"
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        console.error("Failed to load user profile");
      }
    }
    fetchUser();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside className="w-72 h-screen bg-neutral-950 border-r border-white/5 flex flex-col relative z-50">
      
      {/* --- HEADER: BRANDING --- */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <Image src="/logo.svg" alt="Syntra Academy Logo" width={30} height={30} className="rounded-lg" />
          <div>
            <span className="block text-xl font-bold tracking-tighter text-white leading-none">Syntra<span className="text-indigo-500">Academy</span></span>
          </div>
        </Link>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        <div className="px-4 mb-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
            Root Directory
        </div>

        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                isActive 
                  ? "text-white bg-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div 
                    layoutId="active-nav-admin"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-rose-600"
                />
              )}

              <Icon 
                size={18} 
                className={`transition-colors ${isActive ? "text-rose-500" : "text-neutral-500 group-hover:text-rose-400"}`} 
              />
              
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- FOOTER: ROOT PROFILE --- */}
      <div className="p-4 border-t border-white/5 bg-neutral-900/30 shrink-0">
        
        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              className="mb-4 overflow-hidden rounded-xl bg-black/40 border border-white/5"
            >
              <div className="p-4 space-y-3">
                <div>
                   <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Signed in as</div>
                   <div className="text-xs text-white truncate font-mono">{user.email}</div>
                </div>
                
                <div>
                   <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Privileges</div>
                   <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded bg-rose-500/10 border border-rose-500/20 w-full">
                      <Lock size={10} className="text-rose-500" /> 
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide">
                          Root Access Granted
                      </span>
                   </div>
                </div>
                
                <div className="h-px bg-white/10 my-2" />
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                >
                  <LogOut size={14} /> Terminate Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${isProfileOpen ? "bg-white/5 border-white/10" : "hover:bg-white/5 border-transparent hover:border-white/5"}`}
        >
           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-2 ring-black">
              {user.name.charAt(0).toUpperCase()}
           </div>

           <div className="flex-1 text-left">
              <div className="text-sm font-bold text-white truncate max-w-[120px]">{user.name}</div>
              <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                 <span className="uppercase tracking-wider font-bold text-rose-500/90">System Admin</span>
              </div>
           </div>

           <ChevronUp size={16} className={`text-neutral-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

    </aside>
  );
}