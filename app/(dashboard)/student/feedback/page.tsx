"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Minus, 
  CheckCircle2, 
  Loader2,
  Send,
  ShieldCheck,
  AlertOctagon,
  Maximize2
} from "lucide-react";

export default function StudentFeedbackPage() {
  const [message, setMessage] = useState("");
  const [domain, setDomain] = useState("GENERAL");
  const [sentiment, setSentiment] = useState("NEUTRAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!message.trim()) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating network
    try {
        await fetch("/api/student/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, domain, sentiment, priority }),
        });
        setSubmitted(true);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
        setMessage("");
    }
  }

  const resetForm = () => {
      setSubmitted(false);
      setMessage("");
      setSentiment("NEUTRAL");
      setPriority("MEDIUM");
      setDomain("GENERAL");
  };

  return (
    // FULL PAGE CONTAINER - Fixed height to prevent scrolling
    <div className="h-[calc(100vh-1rem)] w-full relative p-4 md:p-8 text-white overflow-hidden bg-neutral-950 flex flex-col justify-center">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="max-w-7xl w-full mx-auto relative z-10 h-full flex flex-col justify-center">

        <AnimatePresence mode="wait">
            {submitted ? (
                // SUCCESS STATE (Centered Modal style)
                <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="max-w-lg mx-auto w-full bg-neutral-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-12 text-center shadow-2xl shadow-emerald-900/20"
                >
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 size={48} className="text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Transmission Complete</h2>
                    <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                        Your feedback has been successfully encrypted and uploaded to the central administrative server.
                    </p>
                    <button 
                        onClick={resetForm}
                        className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all uppercase tracking-widest text-xs"
                    >
                        Send New Report
                    </button>
                </motion.div>
            ) : (
                // MAIN CONSOLE GRID
                <motion.div 
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-h-[800px]"
                >
                    
                    {/* --- LEFT PANEL: PARAMETERS (4 Cols) --- */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                        
                        {/* Header Card */}
                        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                                <MessageSquare size={12} /> Secure Uplink
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Feedback Console</h1>
                            <p className="text-neutral-400 text-xs leading-relaxed">
                                Configure transmission parameters below. All data is anonymized before review.
                            </p>
                        </div>

                        {/* Controls Container */}
                        <div className="flex-1 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between gap-6 overflow-y-auto">
                            
                            {/* 1. Sector */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Target Sector</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["ACADEMICS", "EXAMS", "FEES", "HOSTEL", "GENERAL"].map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => setDomain(opt)}
                                            className={`py-3 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                                domain === opt 
                                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                                : "bg-white/5 border-white/5 text-neutral-400 hover:bg-white/10"
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Sentiment */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Emotional Context</label>
                                <div className="flex gap-2">
                                    {[
                                        { key: "POSITIVE", icon: ThumbsUp, color: "emerald" },
                                        { key: "NEUTRAL", icon: Minus, color: "indigo" },
                                        { key: "NEGATIVE", icon: ThumbsDown, color: "rose" }
                                    ].map((s) => (
                                        <button
                                            key={s.key}
                                            onClick={() => setSentiment(s.key)}
                                            className={`flex-1 py-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                                                sentiment === s.key
                                                ? s.key === "POSITIVE" ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" :
                                                  s.key === "NEUTRAL" ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400" :
                                                  "bg-rose-500/20 border-rose-500/50 text-rose-400"
                                                : "bg-white/5 border-white/5 text-neutral-500 hover:bg-white/10"
                                            }`}
                                        >
                                            <s.icon size={18} />
                                            <span className="text-[9px] font-bold uppercase">{s.key}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 3. Priority */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Priority Level</label>
                                <div className="bg-black/40 p-1 rounded-xl flex border border-white/10">
                                    {["LOW", "MEDIUM", "HIGH"].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPriority(p)}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                                priority === p
                                                ? p === "HIGH" ? "bg-rose-500/20 text-rose-400 shadow-inner" : 
                                                  p === "MEDIUM" ? "bg-amber-500/20 text-amber-400 shadow-inner" : 
                                                  "bg-emerald-500/20 text-emerald-400 shadow-inner"
                                                : "text-neutral-600 hover:text-neutral-400"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* --- RIGHT PANEL: PAYLOAD (8 Cols) --- */}
                    <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                        
                        <div className="flex-1 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-1 relative shadow-xl flex flex-col ring-1 ring-white/5">
                            
                            {/* Text Area Wrapper */}
                            <div className="flex-1 relative">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Initiate feedback protocol... describe your concern, observation, or suggestion in detail."
                                    className="w-full h-full bg-transparent border-none outline-none p-6 md:p-8 text-base md:text-lg text-white placeholder:text-neutral-600 resize-none font-medium leading-relaxed"
                                />
                                
                                {/* Character Count */}
                                <div className="absolute bottom-4 right-6 text-[10px] font-mono text-neutral-600 bg-black/40 px-2 py-1 rounded border border-white/5">
                                    {message.length} CHARS
                                </div>
                            </div>

                            {/* Bottom Action Bar */}
                            <div className="p-4 bg-black/20 border-t border-white/5 rounded-b-[22px] flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest ml-2">
                                    <ShieldCheck size={14} className="text-emerald-500" /> 
                                    Encrypted Channel Active
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !message.trim()}
                                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl py-3 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Transmitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} /> Init Transmission
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}