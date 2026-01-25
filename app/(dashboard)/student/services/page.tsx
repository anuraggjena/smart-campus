"use client";

import { useEffect, useState } from "react";

type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  owningOffice: string;
};

export default function StudentServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/student/services")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const filtered =
    filter === "ALL"
      ? data
      : data.filter((s) => s.category === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-700 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-semibold">Campus Services</h1>
        <p className="text-sm opacity-80">
          Find the right office for the right help
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex gap-3 flex-wrap">
        {["ALL", "HOSTEL", "FEES", "LIBRARY", "TRANSPORT", "GENERAL"].map(
          (c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-md border text-sm ${
                filter === c
                  ? "bg-slate-900 text-white"
                  : "bg-white"
              }`}
            >
              {c}
            </button>
          )
        )}
      </div>

      {/* Services grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="p-6 border rounded-xl shadow-sm bg-white space-y-3 hover:shadow-md transition"
          >
            <div className="text-xs text-slate-500">{s.category}</div>
            <div className="text-lg font-semibold">{s.name}</div>
            <div className="text-sm text-slate-600">
              {s.description}
            </div>
            <div className="text-xs text-slate-500">
              Office: {s.owningOffice}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
