"use client";

import { useEffect, useState } from "react";

type Procedure = {
  id: string;
  code: string;
  title: string;
  domain: string;
  stepsJson: string;
  owningOffice: string;
};

export default function StudentProceduresPage() {
  const [data, setData] = useState<Procedure[]>([]);
  const [selected, setSelected] = useState<Procedure | null>(null);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/student/procedures")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const filtered =
    filter === "ALL"
      ? data
      : data.filter((p) => p.domain === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-700 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-semibold">Procedures & Guides</h1>
        <p className="text-sm opacity-80">
          Step-by-step help for academic and campus tasks
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {["ALL", "ACADEMICS", "EXAMS", "FEES", "HOSTEL", "GENERAL"].map(
          (d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-4 py-2 rounded-md border text-sm ${
                filter === d
                  ? "bg-slate-900 text-white"
                  : "bg-white"
              }`}
            >
              {d}
            </button>
          )
        )}
      </div>

      {/* Procedure list */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="p-5 border rounded-xl shadow-sm bg-white cursor-pointer hover:shadow-md transition"
            onClick={() => setSelected(p)}
          >
            <div className="text-xs text-slate-500">{p.domain}</div>
            <div className="font-semibold text-lg">{p.title}</div>
            <div className="text-sm text-slate-500">
              Managed by {p.owningOffice}
            </div>
          </div>
        ))}
      </div>

      {/* Steps modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white max-w-2xl w-full p-8 rounded-xl space-y-6 overflow-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold">{selected.title}</h2>

            <div className="space-y-4">
              {JSON.parse(selected.stepsJson).map(
                (step: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-900 text-white text-sm">
                      {i + 1}
                    </div>
                    <div>{step}</div>
                  </div>
                )
              )}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
