"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Cpu, 
  Activity, 
  FileText, 
  Shield, 
  Loader2,
  Zap,
  HelpCircle,
  Maximize2,
  AlertCircle
} from "lucide-react";

// --- TYPES ---
type AIResponse = {
  text: string;
  intent: string;
  confidence: number;
  policies: { id: string; title: string }[];
  procedures: { id: string; title: string }[];
};

type Message = 
  | { role: "user"; text: string }
  | { role: "ai"; data: AIResponse };

function formatAIText(text: string) {
  // Bold **text**
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Numbered steps → proper list spacing
  formatted = formatted.replace(/\n\d+\.\s/g, (match) => `<br/><br/>${match}`);

  // Line breaks
  formatted = formatted.replace(/\n/g, "<br/>");

  return formatted;
}

// --- CHAT BUBBLE COMPONENT ---
const ChatBubble = ({ msg }: { msg: Message }) => {
  const isUser = msg.role === "user";
  
  // Helper to check if data exists but is empty
  const hasData = msg.role === "ai" && msg.data;
  const isEmpty = hasData && msg.data!.policies.length === 0 && msg.data!.procedures.length === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mt-1 shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0 backdrop-blur-md">
           <Bot size={20} />
        </div>
      )}

      <div className={`max-w-[85%] lg:max-w-[70%] space-y-2`}>
         <div className={`p-5 rounded-2xl text-sm leading-relaxed border backdrop-blur-md shadow-lg
            ${isUser 
              ? "bg-indigo-600/90 border-indigo-500/50 text-white rounded-tr-none shadow-indigo-500/20" 
              : "bg-white/5 border-white/10 text-neutral-100 rounded-tl-none hover:bg-white/10 transition-colors"}
         `}>
            {isUser ? (
                msg.text
            ) : hasData ? (
                isEmpty ? (
                    // EMPTY STATE MESSAGE
                    <div className="flex items-center gap-3 text-neutral-300">
                        <AlertCircle size={18} className="text-amber-400 shrink-0" />
                        <span>No relevant policy or procedure found.</span>
                    </div>
                ) : (
                    // DATA FOUND STATE
                    <div className="space-y-4">

                        {/* ✨ Groq Explanation Text */}
                        <div
                            className="text-neutral-200 leading-relaxed space-y-2"
                            dangerouslySetInnerHTML={{
                                __html: formatAIText(msg.data.text),
                            }}
                        />

                        {/* Related Documents (only if exist) */}
                        {(msg.data!.policies.length > 0 || msg.data!.procedures.length > 0) && (
                            <div className="pt-4 border-t border-white/10">
                                <div className="mb-3 font-bold text-cyan-300 text-xs uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={12} className="text-cyan-400" />
                                    Related Documents
                                </div>

                                <div className="grid gap-2">
                                    {msg.data!.policies.map(p => (
                                        <a key={p.id} href={`/student/policies/${p.id}`}
                                        target="_blank"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all group">
                                            <Shield size={14} className="text-cyan-400" />
                                            <span className="text-xs text-cyan-100 truncate">{p.title}</span>
                                        </a>
                                    ))}

                                    {msg.data!.procedures.map(p => (
                                        <a key={p.id} href={`/student/procedures/${p.id}`}
                                        target="_blank"
                                        className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group">
                                            <FileText size={14} className="text-indigo-400" />
                                            <span className="text-xs text-indigo-100 truncate">{p.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                )
            ) : (
                "I'm sorry, I couldn't process that request."
            )}
         </div>
      </div>

      {isUser && (
        <div className="h-9 w-9 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mt-1 shadow-lg shrink-0 border border-white/10">
           <User size={18} />
        </div>
      )}
    </motion.div>
  );
};

export default function StudentAssistantPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIResponse | null>(null);
  
  // Auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages, loading]);

  async function askAI(textOverride?: string) {
    const textToSend = textOverride || query;
    if (!textToSend.trim()) return;

    const userMessage: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    setCurrentAnalysis(null);

    try {
        const res = await fetch("/api/student/assistant/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: textToSend }),
        });
        const data: AIResponse = await res.json();
        const aiMessage: Message = { role: "ai", data };
        setMessages((prev) => [...prev, aiMessage]);
        setCurrentAnalysis(data);
    } catch (error) {
        console.error("AI Error:", error);
    } finally {
        setLoading(false);
    }
  }

  return (
    // MAIN CONTAINER - Uses fixed height to fit screen, but allows internal scrolling
    <div className="h-[calc(100vh-1rem)] w-full flex gap-6 p-4 md:p-6 overflow-hidden relative">
      
      {/* --- BRIGHTER ATMOSPHERE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-175 h-175 bg-cyan-500/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-175 h-175 bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      {/* --- LEFT PANEL: CHAT STREAM --- */}
      <div className="flex-1 flex flex-col relative z-10 bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/5">
         
         {/* Header */}
         <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  <Bot size={20} />
               </div>
               <div>
                  <h1 className="text-sm font-bold text-white uppercase tracking-wider">Campus Activity</h1>
                  <p className="text-[10px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.5)] animate-pulse" /> 
                     System Online
                  </p>
               </div>
            </div>
            <button 
                onClick={() => { setMessages([]); setCurrentAnalysis(null); }} 
                className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10 hover:bg-white/5"
            >
                Reset Session
            </button>
         </div>

         {/* Chat Area */}
         <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center opacity-80">
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500/10 to-cyan-500/10 border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                     <Sparkles size={40} className="text-cyan-200/50" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Awaiting Input</h3>
                  <p className="text-sm text-neutral-400 max-w-md mb-10 leading-relaxed">
                     I can process natural language queries regarding campus protocols, academic schedules, and administrative policies.
                  </p>
               </div>
            ) : (
               messages.map((m, i) => <ChatBubble key={i} msg={m} />)
            )}
            
            {loading && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-neutral-500 text-xs ml-4">
                  <Loader2 size={16} className="animate-spin text-cyan-400" />
                  <span className="font-mono uppercase tracking-widest">Processing Data Stream...</span>
               </motion.div>
            )}
            <div ref={messagesEndRef} className="h-1" />
         </div>

         {/* Input Area */}
         <div className="p-5 border-t border-white/10 bg-black/20">
            <div className="flex gap-3">
               <div className="flex-1 relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500/20 to-cyan-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <input
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     onKeyDown={(e) => e.key === "Enter" && askAI()}
                     placeholder="Type your query here..."
                     className="relative w-full bg-neutral-900/80 border border-white/10 rounded-xl px-5 py-4 pr-14 text-sm text-white focus:outline-none focus:border-cyan-500/30 focus:bg-neutral-900 transition-all placeholder:text-neutral-600 font-medium"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                     <span className="text-[10px] text-neutral-500 border border-white/10 px-1.5 py-0.5 rounded bg-white/5">RET</span>
                  </div>
               </div>
               <button
                  onClick={() => askAI()}
                  disabled={!query.trim() || loading}
                  className="bg-linear-to-br from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-xl w-14 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
               >
                  <Send size={20} />
               </button>
            </div>
         </div>

      </div>

      {/* --- RIGHT PANEL: HUD (Hidden on mobile) --- */}
      <div className="hidden lg:flex w-88 flex-col gap-4 shrink-0">
         
         {/* 1. Analysis Core */}
         <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1 shadow-xl relative overflow-hidden flex flex-col ring-1 ring-white/5">
            <div className="flex items-center gap-2 mb-8 shrink-0">
                <Cpu size={18} className="text-cyan-400" />
                <span className="text-xs font-bold text-neutral-200 uppercase tracking-widest">Neural Processor</span>
            </div>

            {currentAnalysis ? (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="space-y-8 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {/* Intent */}
                    <div>
                        <div className="text-[10px] text-neutral-500 uppercase font-bold mb-2">Detected Intent</div>
                        <div className="text-xl font-bold text-white capitalize leading-tight">
                            {currentAnalysis.intent.replace(/_/g, " ").toLowerCase()}
                        </div>
                    </div>

                    {/* Confidence Meter */}
                    <div>
                        <div className="flex justify-between text-[10px] text-neutral-500 uppercase font-bold mb-2">
                            <span>Confidence Score</span>
                            <span className="text-cyan-400">{currentAnalysis.confidence}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${currentAnalysis.confidence}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full shadow-[0_0_10px_currentColor] ${
                                    currentAnalysis.confidence > 80 ? "bg-emerald-500 text-emerald-500" : 
                                    currentAnalysis.confidence > 50 ? "bg-amber-500 text-amber-500" : "bg-rose-500 text-rose-500"
                                }`} 
                            />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-1 group hover:border-cyan-500/20 transition-colors">
                            <div className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{currentAnalysis.policies.length}</div>
                            <div className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Policies</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-1 group hover:border-indigo-500/20 transition-colors">
                            <div className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{currentAnalysis.procedures.length}</div>
                            <div className="text-[9px] text-neutral-500 uppercase font-bold tracking-wider">Procedures</div>
                        </div>
                    </div>

                    {/* Debug Info */}
                    <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-2">
                        <Activity size={14} className="text-indigo-400" />
                        <span className="text-[10px] text-indigo-300/70 font-mono">Inference Time: 45ms</span>
                    </div>
                </motion.div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <Zap size={64} className="text-white mb-6" />
                    <p className="text-xs text-white font-mono uppercase tracking-widest">Waiting for data...</p>
                </div>
            )}
         </div>

         {/* 2. Status Panel */}
         <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-2.5">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                 <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Connected</span>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-600">
                 <Maximize2 size={12} />
                 <span>v1.0</span>
             </div>
         </div>

      </div>

    </div>
  );
}