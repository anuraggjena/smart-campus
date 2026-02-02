"use client";

import { useEffect, useMemo, useState } from "react";

type Service = {
  id: string;
  name: string;
  description: string;
  category: string;
  owningOffice: string;
};

export default function StudentServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/student/services")
      .then((res) => res.json())
      .then(setServices);
  }, []);

  // ⭐ Recommended services (most useful categories)
  const recommended = useMemo(() => {
    return services.filter((s) =>
      ["FEES", "HOSTEL", "ACADEMICS"].includes(s.category)
    ).slice(0, 4);
  }, [services]);

  const filtered =
    filter === "ALL"
      ? services
      : services.filter((s) => s.category === filter);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-slate-800 text-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-semibold">Campus Services</h1>
        <p className="text-sm opacity-80 mt-1">
          Know exactly where to go for the help you need
        </p>
      </div>

      {/* ⭐ Recommended */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Recommended for you</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {recommended.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-xl border bg-indigo-50 border-indigo-100 shadow-sm"
            >
              <div className="text-xs font-medium text-indigo-700">
                {s.category}
              </div>
              <div className="text-lg font-semibold mt-1">
                {s.name}
              </div>
              <div className="text-sm text-slate-600 mt-2">
                {s.description}
              </div>
              <div className="text-xs mt-3 text-slate-500">
                Office: {s.owningOffice}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔎 Category Filters */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Browse by category</h2>
        <div className="flex gap-3 flex-wrap">
          {["ALL", "HOSTEL", "FEES", "LIBRARY", "TRANSPORT", "GENERAL"].map(
            (c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-lg text-sm border transition ${
                  filter === c
                    ? "bg-slate-900 text-white"
                    : "bg-white hover:bg-slate-100"
                }`}
              >
                {c}
              </button>
            )
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="text-xs text-slate-500">
                {s.category}
              </div>
              <div className="text-lg font-semibold mt-1">
                {s.name}
              </div>
              <div className="text-sm text-slate-600 mt-2">
                {s.description}
              </div>
              <div className="text-xs mt-3 text-slate-500">
                Office: {s.owningOffice}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
