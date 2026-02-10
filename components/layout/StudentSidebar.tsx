"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Bot, 
  Coffee, 
  FileText, 
  Bell, 
  MessageSquare, 
  ShieldAlert, 
  Calendar, 
  LogOut, 
  ChevronUp, 
  Sparkles
} from "lucide-react";

// Navigation Configuration
const links = [
  { href: "/student/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/student/assistant", label: "AI Assistant", icon: Bot, isSpecial: true },
  { href: "/student/services", label: "Campus Services", icon: Coffee },
  { href: "/student/policies", label: "Policy Vault", icon: ShieldAlert },
  { href: "/student/procedures", label: "Procedures", icon: FileText },
  { href: "/student/events", label: "Academic Events", icon: Calendar },
  { href: "/student/announcements", label: "Notices", icon: Bell },
  { href: "/student/feedback", label: "Feedback", icon: MessageSquare },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState({ name: "Student", email: "Loading...", role: "STUDENT" });

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
        <Link href="/student/dashboard" className="flex items-center gap-3 group">
          <Image src="/logo.svg" alt="Syntra Academy Logo" width={30} height={30} className="rounded-lg" />
          <div>
            <span className="block text-xl font-bold tracking-tighter text-white leading-none">Syntra<span className="text-indigo-500">Academy</span></span>
          </div>
        </Link>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      {/* Added utility classes here to hide scrollbar */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        <div className="px-4 mb-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
            Main Interface
        </div>

        {links.map((link) => {
          const isActive = pathname === link.href;
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
                    layoutId="active-nav"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500"
                />
              )}

              <Icon 
                size={18} 
                className={`transition-colors ${isActive ? "text-indigo-400" : "text-neutral-500 group-hover:text-indigo-300"} ${link.isSpecial ? "text-cyan-400 animate-pulse" : ""}`} 
              />
              
              <span>{link.label}</span>

              {link.isSpecial && (
                <div className="ml-auto px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                   <Sparkles size={8} /> AI
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* --- FOOTER: PILOT PROFILE --- */}
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
                   <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Identity</div>
                   <div className="text-xs text-white truncate font-mono">{user.email}</div>
                </div>
                <div>
                   <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Clearance</div>
                   <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400">
                      <ShieldAlert size={10} /> {user.role}
                   </div>
                </div>
                
                <div className="h-px bg-white/10 my-2" />
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors p-2 rounded-lg hover:bg-rose-500/10"
                >
                  <LogOut size={14} /> Disconnect Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${isProfileOpen ? "bg-white/5 border-white/10" : "hover:bg-white/5 border-transparent hover:border-white/5"}`}
        >
           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-2 ring-black">
              {user.name.charAt(0).toUpperCase()}
           </div>

           <div className="flex-1 text-left">
              <div className="text-sm font-bold text-white truncate max-w-[120px]">{user.name}</div>
              <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </div>
           </div>

           <ChevronUp size={16} className={`text-neutral-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

    </aside>
  );
}