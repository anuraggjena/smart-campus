"use client";

import { useEffect, useState } from "react";

export default function HodDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hod/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">Department Overview</h2>
        <p className="text-gray-600">
          Insights and activity from your department
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card title="Announcements Created" value={data.announcements} />
        <Card title="Academic Events" value={data.events} />
        <Card title="Feedback Received" value={data.feedback} />
        <Card title="Active Policies" value={data.policies} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold">Department PCI Insight</h3>
        <p className="text-gray-700 mt-2">
          {data.pciInsight}
        </p>
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <div className="text-gray-500">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}
