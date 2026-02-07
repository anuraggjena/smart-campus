import { db } from "@/lib/db/client";
import { policies } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";

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
    return <div className="p-6">Policy not found</div>;
  }

  const p = policy[0];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">{p.title}</h1>
      <p className="text-sm text-slate-500 mb-4">
        {p.domain} • v{p.version} • {p.owningOffice}
      </p>
      <div>{p.content}</div>
    </div>
  );
}