"use client";

import { useEffect, useState } from "react";

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <div className="text-slate-500 text-sm">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}

export default function HodDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hod/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-700 text-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Department Overview</h2>
        <p className="text-sm opacity-80">
          Activity and insights from your department
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Dept Announcements" value={data.announcements} />
        <StatCard title="Academic Events" value={data.events} />
        <StatCard title="Feedback Received" value={data.feedback} />
        <StatCard title="Students in Department" value={data.students} />
      </div>

      {/* PCI Insight */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">Department PCI Insight</h3>
        <p className="text-slate-700 mt-2">{data.pciInsight}</p>
      </div>

    </div>
  );
}
