"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-linear-to-r from-slate-900 to-slate-700 text-white px-8 py-6 shadow">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-sm text-slate-200">
          Here’s what matters for you today
        </p>
      </div>

      {/* Attention Row */}
      <div className="grid grid-cols-3 gap-6">
        <AttentionCard
          title="Urgent Announcements"
          value={data?.urgentAnnouncements ?? 0}
        />
        <AttentionCard
          title="Upcoming Academic Events"
          value={data?.upcomingEvents ?? 0}
        />
        <AttentionCard
          title="Active Policies Impacting You"
          value={data?.activePolicies ?? 0}
        />
      </div>

      {/* Intelligence Insights */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-5">
          <h3 className="font-semibold mb-2">Campus Intelligence Insights</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            {data?.insights?.length
              ? data.insights.map((i: string, idx: number) => (
                  <li key={idx}>• {i}</li>
                ))
              : <li>No special insights right now.</li>}
          </ul>
        </CardContent>
      </Card>

      {/* Campus Snapshot */}
      <div className="grid grid-cols-4 gap-6">
        <Metric label="Total Services" value={data?.services ?? 0} />
        <Metric label="Policies" value={data?.policies ?? 0} />
        <Metric label="Announcements" value={data?.announcements ?? 0} />
        <Metric label="Procedures" value={data?.procedures ?? 0} />
      </div>
    </div>
  );
}

function AttentionCard({ title, value }: { title: string; value: number }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-5">
        <p className="text-xs text-slate-500">{title}</p>
        <p className="text-2xl font-bold mt-1">
          {value ?? 0}
        </p>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-5 text-center">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-xl font-semibold mt-1">
          {value ?? 0}
        </p>
      </CardContent>
    </Card>
  );
}