"use client";

import { useEffect, useState } from "react";

type Policy = {
  id: string;
  code: string;
  title: string;
  domain: string;
  content: string;
  version: string;
  owningOffice: string;
};

export default function StudentPoliciesPage() {
  const [data, setData] = useState<Policy[]>([]);
  const [selected, setSelected] = useState<Policy | null>(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/student/policies")
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
        <h1 className="text-2xl font-semibold">Institutional Policies</h1>
        <p className="text-sm opacity-80">
          Understand rules, regulations and procedures clearly
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        {["ALL", "FEES", "EXAMS", "HOSTEL", "ACADEMICS", "GENERAL"].map(
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

      {/* Policies list */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="p-6 border rounded-xl shadow-sm bg-white cursor-pointer hover:shadow-md transition space-y-2"
            onClick={() => setSelected(p)}
          >
            <div className="text-xs text-slate-500">{p.domain}</div>
            <div className="text-lg font-semibold">{p.title}</div>
            <div className="text-xs text-slate-500">
              Version {p.version} • {p.owningOffice}
            </div>
          </div>
        ))}
      </div>

      {/* Policy content modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white max-w-3xl w-full p-8 rounded-xl overflow-auto max-h-[80vh] space-y-4">
            <h2 className="text-xl font-semibold">{selected.title}</h2>

            <div className="text-sm text-slate-600 whitespace-pre-line">
              {selected.content}
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
