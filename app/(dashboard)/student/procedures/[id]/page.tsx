import { db } from "@/lib/db/client";
import { procedures } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";

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
    return <div className="p-6">Procedure not found</div>;
  }

  const p = proc[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{p.title}</h1>

      <div className="space-y-3">
        {JSON.parse(p.stepsJson).map((step: string, i: number) => (
          <div key={i} className="flex gap-3">
            <div className="font-bold">{i + 1}.</div>
            <div>{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
