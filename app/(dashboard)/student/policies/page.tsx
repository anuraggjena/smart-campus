"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/student/policies")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const filtered = useMemo(() => {
    return data
      .filter((p) =>
        filter === "ALL" ? true : p.domain === filter
      )
      .filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase())
      );
  }, [data, filter, search]);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-slate-800 text-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-semibold">Institutional Policies</h1>
        <p className="text-sm opacity-80 mt-1">
          Quickly find and understand campus rules and regulations
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <input
          placeholder="Search by policy name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 text-sm"
        />

        <div className="flex gap-3 flex-wrap">
          {["ALL", "FEES", "EXAMS", "HOSTEL", "ACADEMICS", "GENERAL"].map(
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

      {/* Policies grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((p) => (
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
                v{p.version}
              </span>
            </div>

            <div className="text-lg font-semibold">{p.title}</div>

            <div className="text-xs text-slate-500">
              Code: {p.code}
            </div>

            <div className="text-xs text-slate-500">
              Owning Office: {p.owningOffice}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-4xl w-full p-8 rounded-2xl overflow-auto max-h-[85vh] space-y-6">

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold">
                  {selected.title}
                </h2>
                <p className="text-sm text-slate-500">
                  {selected.domain} • v{selected.version} • {selected.owningOffice}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm"
              >
                Close
              </button>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {selected.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
