"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  BookOpen, 
  LifeBuoy, 
  Activity, 
  ChevronRight, 
  Megaphone,
  Search,
  CheckCircle2,
  Loader2,
  Clock,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- COMPONENTS ---

// 1. HUD Stat Card
const HudCard = ({ label, value, icon: Icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={`relative overflow-hidden rounded-2xl border border-white/10 p-6 group transition-all duration-300 cursor-default
      ${color === 'rose' ? 'bg-rose-950/20 hover:border-rose-500/50 hover:bg-rose-900/20' : ''}
      ${color === 'indigo' ? 'bg-indigo-950/20 hover:border-indigo-500/50 hover:bg-indigo-900/20' : ''}
      ${color === 'cyan' ? 'bg-cyan-950/20 hover:border-cyan-500/50 hover:bg-cyan-900/20' : ''}
      backdrop-blur-md
    `}
  >
    {/* Inner Glow */}
    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-${color}-500/10 blur-3xl group-hover:bg-${color}-500/20 transition-all duration-500`} />
    
    <div className="relative z-10 flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-white/5 text-${color}-300 border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} />
        </div>
        {value > 0}
    </div>
    <div className="relative z-10">
        <div className="text-4xl font-bold text-white tracking-tighter drop-shadow-sm">{value}</div>
        <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-widest mt-1 group-hover:text-white transition-colors">{label}</div>
    </div>
  </motion.div>
);

// 2. Section Header
const SectionHeader = ({ title, icon: Icon, color = "indigo", onViewAll }: any) => (
  <div className="flex items-center justify-between mb-5 px-1">
    <div className="flex items-center gap-2.5">
      <div className={`p-1.5 rounded-lg bg-${color}-500/20 text-${color}-200 shadow-[0_0_10px_rgba(255,255,255,0.1)]`}>
        <Icon size={16} />
      </div>
      <h3 className="text-sm font-bold text-white uppercase tracking-widest drop-shadow-md">{title}</h3>
    </div>
    
    <button 
        onClick={onViewAll}
        className="text-[10px] font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1 group bg-white/5 px-2 py-1 rounded-lg border border-white/5 hover:bg-white/10 cursor-pointer"
    >
      View All <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
    </button>
  </div>
);

// 3. Empty State Helper
const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/20 rounded-2xl bg-black/20 backdrop-blur-sm cursor-default">
        <div className="p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 mb-3 shadow-inner">
            <CheckCircle2 size={20} />
        </div>
        <p className="text-xs font-medium text-neutral-300 uppercase tracking-wide">{message}</p>
    </div>
);


export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then(res => res.json())
      .then(json => {
          setData(json);
          setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  // --- LOADING SCREEN ---
  if (loading || !data) {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-neutral-950">
             {/* Background for loading */}
             <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950" />
             </div>
            
            <div className="relative z-10 flex flex-col items-center">
                <Loader2 size={48} className="text-indigo-400 animate-spin mb-6" />
                <p className="text-xs font-mono text-indigo-300 uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
            </div>
        </div>
    );
  }

  const urgentCount = data.importantAnnouncements.filter(
    (a: any) => a.priority === "URGENT"
  ).length;

  return (
    <div className="min-h-screen w-full relative p-6 md:p-10 text-white overflow-hidden bg-neutral-950">
      
      {/* --- VIBRANT BACKGROUND ATMOSPHERE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[-10%] w-150 h-150 bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 bg-neutral-900/30 backdrop-blur-xl p-6 rounded-3xl border-t border-l shadow-2xl">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Student Node</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 drop-shadow-lg">Command Center</h1>
                <p className="text-neutral-300 text-xs italic">
                     Welcome back. Here's your personalized dashboard with the latest updates, events, and insights to help you navigate campus life.
                </p>
            </div>
             {/* Live Feed Pill */}
             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-md cursor-default">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Data Feed
            </div>
        </div>

        {/* --- TOP STRIP (HUD STATS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HudCard 
                label="Urgent Notices" 
                value={urgentCount} 
                icon={AlertTriangle} 
                color={urgentCount > 0 ? "rose" : "indigo"} 
                delay={0.1} 
            />
            <HudCard 
                label="Events This Week" 
                value={data.upcomingEvents.length} 
                icon={Calendar} 
                color="cyan" 
                delay={0.2} 
            />
            <HudCard 
                label="Active Queries" 
                value={data.suggestedProcedures.length} 
                icon={TrendingUp} 
                color="indigo" 
                delay={0.3} 
            />
        </div>

        {/* --- ROW 1: ANNOUNCEMENTS & EVENTS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. ANNOUNCEMENTS */}
            <section className="bg-black/20 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <SectionHeader 
                    title="Announcements" 
                    icon={Megaphone} 
                    color="rose" 
                    onViewAll={() => router.push('/student/announcements')} 
                />
                <div className="space-y-4">
                    {data.importantAnnouncements.length === 0 ? (
                        <EmptyState message="No important announcements received." />
                    ) : (
                        data.importantAnnouncements.map((a: any, i: number) => (
                            <motion.div 
                                key={a.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-5 rounded-2xl border transition-all relative overflow-hidden cursor-default
                                    ${a.priority === "URGENT" 
                                    ? "bg-rose-950/40 border-rose-500/40 hover:border-rose-500" 
                                    : "bg-white/5 border-white/10 hover:border-rose-400/40 hover:bg-white/10"}
                                `}
                            >
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <h4 className={`text-sm font-bold ${a.priority === "URGENT" ? "text-rose-200" : "text-white"} transition-colors`}>
                                        {a.title}
                                    </h4>
                                    {a.priority === "URGENT" && (
                                        <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-[9px] font-bold text-rose-300 uppercase tracking-wide shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                                            Urgent
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2 relative z-10">{a.message}</p>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* 2. UPCOMING EVENTS */}
            <section className="bg-black/20 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <SectionHeader 
                    title="Upcoming Events" 
                    icon={Calendar} 
                    color="cyan" 
                    onViewAll={() => router.push('/student/events')}
                />
                <div className="space-y-4">
                    {data.upcomingEvents.length === 0 ? (
                        <EmptyState message="No scheduled events." />
                    ) : (
                        data.upcomingEvents.map((e: any, i: number) => (
                            <motion.div 
                                key={e.id}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-5 p-4 rounded-2xl border border-white/10 bg-white/5 cursor-default relative overflow-hidden hover:border-cyan-400/40 hover:bg-white/10 transition-all duration-300"
                            >
                                {/* Date Box */}
                                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-neutral-900/80 border border-white/10 shadow-lg relative z-10">
                                    <span className="text-[9px] font-bold text-neutral-400 uppercase">{new Date(e.startDate).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-xl font-bold text-white">{new Date(e.startDate).getDate()}</span>
                                </div>
                                
                                <div className="flex-1 relative z-10">
                                    <h4 className="text-sm font-bold text-white line-clamp-1">{e.title}</h4>
                                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                                         <span className="flex items-center gap-1"><Clock size={10} /> {new Date(e.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>
        </div>

        {/* --- ROW 2: PROCEDURES & SERVICES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 3. TRENDING HELP */}
            <section>
                <SectionHeader 
                    title="Trending Procedures" 
                    icon={Search} 
                    color="indigo" 
                    onViewAll={() => router.push('/student/procedures')}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.suggestedProcedures.map((p: any) => (
                        <div 
                            key={p.id} 
                            className="p-4 rounded-2xl border border-white/10 bg-indigo-950/10 flex flex-col justify-between h-28 relative overflow-hidden backdrop-blur-sm cursor-default hover:border-indigo-400/40 hover:bg-indigo-950/30 transition-all duration-300"
                        >
                             <span className="w-fit px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[9px] font-mono text-indigo-300">
                                {p.code}
                            </span>
                            
                            <p className="text-xs font-bold text-neutral-200 line-clamp-2 mt-2">
                                {p.title}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

             {/* 4. SERVICES */}
             <section>
                <SectionHeader 
                    title="Campus Services" 
                    icon={LifeBuoy} 
                    color="emerald" 
                    onViewAll={() => router.push('/student/services')}
                />
                <div className="space-y-3">
                    {data.suggestedServices.map((s: any) => (
                        <div 
                            key={s.id} 
                            className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-emerald-950/10 cursor-default backdrop-blur-sm hover:border-emerald-400/40 hover:bg-emerald-950/20 transition-all duration-300"
                        >
                             <div className="h-10 w-10 rounded-full bg-black/40 flex items-center justify-center border border-white/10 text-emerald-500/80 shadow-lg">
                                <LifeBuoy size={18} />
                             </div>
                             <div>
                                <p className="text-sm font-bold text-white">{s.name}</p>
                                <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">{s.description}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* --- ROW 3: POLICIES & LOGS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 5. CONFUSING POLICIES */}
            <section className="bg-black/20 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                 <SectionHeader 
                    title="Clarification Needed" 
                    icon={BookOpen} 
                    color="amber" 
                    onViewAll={() => router.push('/student/policies')}
                 />
                 <div className="space-y-3">
                    {data.confusingPolicies.map((p: any) => (
                        <div 
                            key={p.id} 
                            className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5 cursor-default hover:border-amber-400/40 hover:bg-amber-950/10 transition-all duration-300"
                        >
                             <div className="flex items-center gap-4">
                                 <div className="w-1 h-8 bg-amber-500/50 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                 <div>
                                     <p className="text-sm font-bold text-white">{p.title}</p>
                                     <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">{p.domain}</p>
                                 </div>
                             </div>
                        </div>
                    ))}
                 </div>
            </section>

            {/* 6. RECENT ACTIVITY */}
            <section className="bg-black/20 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <SectionHeader 
                    title="Recent Activity" 
                    icon={Activity} 
                    color="violet" 
                    onViewAll={() => router.push('/student/assistant')}
                />
                <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden min-h-45">
                    {data.myRecentActivity.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                             <Activity size={24} className="text-neutral-700 mb-2" />
                             <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">Neural link silent</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10 font-mono">
                            {data.myRecentActivity.map((i: any) => (
                                <div key={i.id} className="p-3.5 flex items-center justify-between cursor-default hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                                        <span className="text-xs text-neutral-400 truncate max-w-50 md:max-w-75">
                                            &gt; {i.intent}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-neutral-600">
                                        {new Date(i.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </div>
      </div>
    </div>
  );
}