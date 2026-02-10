import { db } from "@/lib/db/client";
import { procedures } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { 
  ArrowLeft, 
  Building2, 
  ListOrdered,
  CheckCircle2
} from "lucide-react";

export default async function ProcedureView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const proc = await db
    .select()
    .from(procedures)
    .where(eq(procedures.id, id))
    .limit(1);

  if (proc.length === 0) {
    return (
        <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-xl font-bold text-rose-500">404 - Protocol Not Found</h1>
            <Link href="/student/procedures" className="mt-4 text-sm text-neutral-400 hover:text-white underline">Return to Grid</Link>
        </div>
    );
  }

  const p = proc[0];
  const steps: string[] = JSON.parse(p.stepsJson);

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white relative">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-cyan-900/20 to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 px-6 py-10 md:py-14">
        
        <Link 
            href="/student/procedures" 
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-cyan-400 uppercase tracking-widest mb-8 transition-colors group"
        >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Protocols
        </Link>

        {/* Header */}
        <div className="mb-10">
            <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    {p.domain}
                </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight tracking-tight">{p.title}</h1>
            
            <div className="flex items-center gap-6 text-sm text-neutral-400 border-y border-white/10 py-6">
                <div className="flex items-center gap-2">
                    <ListOrdered size={16} className="text-cyan-500" />
                    <span>{steps.length} Steps</span>
                </div>
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-cyan-500" />
                    <span>{p.owningOffice}</span>
                </div>
            </div>
        </div>

        {/* Steps Timeline */}
        <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-12 pb-10">
            {steps.map((step, index) => (
                <div key={index} className="relative pl-8 md:pl-12 group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-neutral-800 border border-white/20 group-hover:bg-cyan-500 group-hover:border-cyan-500 group-hover:shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all z-10" />
                    
                    {/* Step Number */}
                    <div className="absolute -left-12 top-[-2px] text-xs font-mono text-neutral-600 w-8 text-right group-hover:text-cyan-400 transition-colors">
                        {(index + 1).toString().padStart(2, '0')}
                    </div>

                    <div className="p-6 rounded-2xl bg-neutral-900/40 border border-white/5 group-hover:border-white/10 group-hover:bg-white/5 transition-all">
                        <p className="text-neutral-300 leading-relaxed group-hover:text-white transition-colors">{step}</p>
                    </div>
                </div>
            ))}

            {/* End Marker */}
            <div className="relative pl-8 md:pl-12">
                <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle2 size={14} /> Process Complete
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}