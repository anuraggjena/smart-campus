"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Announcement = {
  id: string;
  title: string;
  message: string;
  priority: string;
};

type Event = {
  id: string;
  title: string;
  startDate: string;
};

type Procedure = {
  id: string;
  title: string;
  code: string;
};

type Service = {
  id: string;
  name: string;
  description: string;
};

type Policy = {
  id: string;
  title: string;
  domain: string;
};

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-8">Loading your campus feed...</div>;

  return (
    <div className="space-y-8 max-w-6xl">
      <h2 className="text-2xl font-semibold">
        Your Campus Today
      </h2>

      {/* Important Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Important for You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.importantAnnouncements.map((a: Announcement) => (
            <div key={a.id} className="border p-4 rounded-md">
              <div className="flex justify-between">
                <p className="font-medium">{a.title}</p>
                <Badge>{a.priority}</Badge>
              </div>
              <p className="text-sm text-slate-600">{a.message}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Department Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.upcomingEvents.map((e: Event) => (
            <div key={e.id} className="border p-3 rounded-md">
              <p className="font-medium">{e.title}</p>
              <p className="text-sm text-slate-600">
                {new Date(e.startDate).toDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Suggested Procedures */}
      <Card>
        <CardHeader>
          <CardTitle>
            Students are asking about this
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.suggestedProcedures.map((p: Procedure) => (
            <div key={p.id} className="border p-3 rounded-md">
              <p className="font-medium">{p.title}</p>
              <Badge variant="secondary">{p.code}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle>Useful Services for You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.suggestedServices.map((s: Service) => (
            <div key={s.id} className="border p-3 rounded-md">
              <p className="font-medium">{s.name}</p>
              <p className="text-sm text-slate-600">
                {s.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Confusing Policies */}
      <Card>
        <CardHeader>
          <CardTitle>
            Policies students find confusing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.confusingPolicies.map((p: Policy) => (
            <div key={p.id} className="border p-3 rounded-md">
              <p className="font-medium">{p.title}</p>
              <Badge>{p.domain}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
