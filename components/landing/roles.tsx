"use client";
import React from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Zap, ArrowRight, LayoutDashboard, FileText, BarChart3 } from "lucide-react";

const roles = [
  {
    title: "Student Portal",
    subtitle: "The Intelligence Hub",
    description: "Ask questions in natural language, track procedure steps, and receive instant institutional guidance without visiting an office.",
    icon: Users,
    color: "from-cyan-500 to-blue-500",
    glow: "group-hover:shadow-cyan-500/20",
    border: "group-hover:border-cyan-500/50",
    text: "text-cyan-400",
    features: ["Natural Language Search", "Step-by-Step Guides", "Instant Feedback Loop"]
  },
  {
    title: "HOD Portal",
    subtitle: "Department Governance",
    description: "Manage department-specific events, audit content quality, and view clarity metrics for your specific domain.",
    icon: ShieldCheck,
    color: "from-violet-500 to-purple-500",
    glow: "group-hover:shadow-purple-500/20",
    border: "group-hover:border-purple-500/50",
    text: "text-purple-400",
    features: ["Dept. Event Management", "Content Auditing", "Domain Analytics"]
  },
  {
    title: "Admin Command",
    subtitle: "Global PCI Analytics",
    description: "The master view. Track the Process Clarity Index (PCI) across the entire campus and identify friction points in real-time.",
    icon: Zap,
    color: "from-emerald-500 to-teal-500",
    glow: "group-hover:shadow-emerald-500/20",
    border: "group-hover:border-emerald-500/50",
    text: "text-emerald-400",
    features: ["Global PCI Heatmap", "Policy Version Control", "Role Management"]
  }
];

export default function RolesSection() {
  return (
    <section id="roles" className="py-32 px-6 bg-neutral-950 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-125 bg-indigo-900/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-6"
          >
            Three Portals. <span className="text-indigo-500">One Truth.</span>
          </motion.h2>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Syntra Academy provides specialized, secure environments for every stakeholder, 
            ensuring data privacy and role-specific intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative p-1 rounded-[2.5rem] bg-linear-to-b from-white/10 to-transparent hover:to-white/5 transition-all duration-500`}
            >
              {/* Inner Card */}
              <div className={`relative h-full bg-neutral-900/90 backdrop-blur-xl rounded-[2.4rem] p-8 border border-white/5 ${role.border} transition-colors duration-500 overflow-hidden`}>
                
                {/* Hover Glow Effect */}
                <div className={`absolute -right-20 -top-20 w-64 h-64 bg-linear-to-br ${role.color} opacity-0 group-hover:opacity-10 blur-[80px] transition-opacity duration-700`} />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 ${role.text} group-hover:scale-110 transition-transform duration-300`}>
                    <role.icon size={28} />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-1">{role.title}</h3>
                  <span className={`text-xs font-bold tracking-widest uppercase ${role.text} mb-4 block opacity-80`}>
                    {role.subtitle}
                  </span>
                  
                  <p className="text-neutral-400 text-sm leading-relaxed mb-8">
                    {role.description}
                  </p>

                  {/* Feature List (Mini Mockup Look) */}
                  <div className="mt-auto space-y-3">
                    {role.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-medium text-neutral-300 bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${role.color}`} />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}