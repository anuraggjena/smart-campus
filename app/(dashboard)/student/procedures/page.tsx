"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/student/procedures")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const filtered = useMemo(() => {
    return data
      .filter((p) =>
        filter === "ALL" ? true : p.domain === filter
      )
      .filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
  }, [data, filter, search]);

  function parseSteps(steps: string) {
    try {
      return JSON.parse(steps);
    } catch {
      return [];
    }
  }

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-slate-800 text-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-semibold">Procedures & Guides</h1>
        <p className="text-sm opacity-80 mt-1">
          Step-by-step help for every academic and campus process
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <input
          placeholder="Search procedures..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />

        <div className="flex gap-3 flex-wrap">
          {["ALL", "ACADEMICS", "EXAMS", "FEES", "HOSTEL", "GENERAL"].map(
            (d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-4 py-2 rounded-full border text-sm ${
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
      </div>

      {/* Procedures grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((p) => {
          const steps = parseSteps(p.stepsJson);

          return (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              className="p-6 border rounded-2xl shadow-sm bg-white cursor-pointer hover:shadow-md transition space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs px-3 py-1 rounded-full bg-slate-100">
                  {p.domain}
                </span>
                <span className="text-xs text-slate-500">
                  {steps.length} steps
                </span>
              </div>

              <div className="text-lg font-semibold">{p.title}</div>

              <div className="text-xs text-slate-500">
                Managed by {p.owningOffice}
              </div>
            </div>
          );
        })}
      </div>

      {/* Steps Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full p-8 rounded-2xl overflow-auto max-h-[85vh] space-y-8">

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">
                  {selected.title}
                </h2>
                <p className="text-sm text-slate-500">
                  {selected.domain} • {selected.owningOffice}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm"
              >
                Close
              </button>
            </div>

            <div className="relative border-l-2 border-slate-200 pl-6 space-y-8">
              {parseSteps(selected.stepsJson).map(
                (step: string, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-8.5 top-0 h-8 w-8 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm">
                      {i + 1}
                    </div>
                    <div className="text-sm text-slate-700">
                      {step}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
