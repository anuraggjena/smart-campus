import { db } from "@/lib/db/client";
import { policies } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShieldCheck, 
  Building2, 
  History, 
  FileText,
  Printer,
  Share2
} from "lucide-react";

export default async function PolicyView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const policy = await db
    .select()
    .from(policies)
    .where(eq(policies.id, id))
    .limit(1);

  if (policy.length === 0) {
    return (
        <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-xl font-bold text-rose-500">404 - Document Not Found</h1>
            <Link href="/student/policies" className="mt-4 text-sm text-neutral-400 hover:text-white underline">Return to Vault</Link>
        </div>
    );
  }

  const p = policy[0];

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white relative">
      
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-900/20 to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 px-6 py-10 md:py-14">
        
        {/* --- NAV --- */}
        <Link 
            href="/student/policies" 
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-emerald-400 uppercase tracking-widest mb-8 transition-colors group"
        >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Vault
        </Link>

        {/* --- DOCUMENT HEADER --- */}
        <div className="mb-10">
            <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    {p.domain}
                </span>
                <span className="px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 text-xs font-mono">
                    {p.code}
                </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">{p.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-neutral-400 border-y border-white/10 py-6">
                <div className="flex items-center gap-2">
                    <History size={16} className="text-emerald-500" />
                    <span>Version <span className="text-white font-mono">{p.version}</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-emerald-500" />
                    <span>{p.owningOffice}</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Official Document</span>
                </div>
                
                {/* Actions */}
                <div className="ml-auto flex gap-3">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neutral-500 hover:text-white">
                        <Printer size={18} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neutral-500 hover:text-white">
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
        </div>

        {/* --- DOCUMENT CONTENT --- */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-neutral-300 prose-a:text-emerald-400 prose-strong:text-white prose-li:text-neutral-300">
            <div className="bg-neutral-900/30 border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                <div className="whitespace-pre-line leading-relaxed">
                    {p.content}
                </div>
                
                <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-neutral-600 font-mono uppercase tracking-widest">
                    <span>End of Document</span>
                    <div className="flex items-center gap-2">
                        <FileText size={12} />
                        <span>Confidentiality Level: Low</span>
                    </div>
                </div>
            </div>
        </article>

      </div>
    </div>
  );
}