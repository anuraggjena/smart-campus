"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Megaphone, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  ChevronUp, 
  ShieldCheck,
  Building2,
  FileSignature
} from "lucide-react";

// --- CONFIGURATION ---

const links = [
  { href: "/hod/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hod/academics", label: "Academic Events", icon: Calendar },
  { href: "/hod/announcements", label: "Announcements", icon: Megaphone },
  { href: "/hod/feedback", label: "Student Feedback", icon: MessageSquare },
];

// 1. Schema-Based Department Lookup
// Maps the 'code' (from database) to the full 'name'
const DEPARTMENT_LOOKUP: Record<string, string> = {
  "CSE": "Computer Science & Engineering",
  "ECE": "Electronics & Communication",
  "MECH": "Mechanical Engineering",
  "CIVIL": "Civil Engineering",
  "EEE": "Electrical & Electronics",
  "IT": "Information Technology",
  "MBA": "Business Administration",
  "GENERAL": "General Administration"
};

export function HodSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 2. User State initialized with default HOD structure
  const [user, setUser] = useState({ 
      name: "Loading...", 
      email: "...", 
      role: "HOD", 
      departmentId: "CSE" // Defaulting to CSE as per request
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          // Ensure we capture the departmentId from the API response
          setUser({ 
            ...data, 
            departmentId: data.departmentId || data.department || "CSE" 
          });
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

  // 3. Resolve Department Name
  // If the ID exists in our lookup, use the full name. Otherwise fall back to the ID.
  const departmentCode = user.departmentId;
  const departmentFullName = DEPARTMENT_LOOKUP[departmentCode] || departmentCode;

  return (
    <aside className="w-72 h-screen bg-neutral-950 border-r border-white/5 flex flex-col relative z-50">
      
      {/* --- HEADER: BRANDING --- */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
        <Link href="/hod/dashboard" className="flex items-center gap-3 group">
          <Image src="/logo.svg" alt="Syntra Academy Logo" width={30} height={30} className="rounded-lg" />
          <div>
            <span className="block text-xl font-bold tracking-tighter text-white leading-none">Syntra<span className="text-indigo-500">Academy</span></span>
          </div>
        </Link>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        <div className="px-4 mb-2 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
            Department Control
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
                    layoutId="active-nav-hod"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-amber-500"
                />
              )}

              <Icon 
                size={18} 
                className={`transition-colors ${isActive ? "text-amber-400" : "text-neutral-500 group-hover:text-amber-300"}`} 
              />
              
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* --- FOOTER: PROFILE --- */}
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
                
                {/* JURISDICTION DISPLAY (Full Name) */}
                <div>
                   <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Jurisdiction</div>
                   <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded bg-neutral-800 border border-white/10 w-full">
                      <Building2 size={12} className="text-amber-500" /> 
                      <span className="text-[10px] font-bold text-neutral-200 uppercase truncate">
                          {departmentFullName}
                      </span>
                   </div>
                </div>
                
                <div className="h-px bg-white/10 my-2" />
                
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-2 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors p-2 rounded-lg hover:bg-rose-500/10"
                >
                  <LogOut size={14} /> End Session
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border ${isProfileOpen ? "bg-white/5 border-white/10" : "hover:bg-white/5 border-transparent hover:border-white/5"}`}
        >
           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-2 ring-black">
              {user.name.charAt(0).toUpperCase()}
           </div>

           <div className="flex-1 text-left">
              <div className="text-sm font-bold text-white truncate max-w-[120px]">{user.name}</div>
              <div className="text-[10px] text-neutral-400 flex items-center gap-1.5">
                 <ShieldCheck size={10} className="text-amber-500" />
                 {/* ID Display (Short Code e.g. CSE HOD) */}
                 <span className="uppercase tracking-wider font-bold text-amber-500/90">{departmentCode} HOD</span>
              </div>
           </div>

           <ChevronUp size={16} className={`text-neutral-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

    </aside>
  );
}