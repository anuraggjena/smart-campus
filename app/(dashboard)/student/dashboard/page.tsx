"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data)
    return <div className="p-8">Loading your campus intelligence...</div>;

  const urgentCount = data.importantAnnouncements.filter(
    (a: any) => a.priority === "URGENT"
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* TOP STRIP */}
      <div className="bg-linear-to-r from-slate-900 to-slate-700 text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row md:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold">Your Campus Today</h1>
          <p className="text-sm opacity-80">
            Personalized updates, help and insights based on your activity
          </p>
        </div>

        <div className="flex gap-10 text-center">
          <div>
            <div className="text-2xl font-bold">{urgentCount}</div>
            <div className="text-xs opacity-80">Urgent Notices</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {data.upcomingEvents.length}
            </div>
            <div className="text-xs opacity-80">Events This Week</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {data.suggestedProcedures.length}
            </div>
            <div className="text-xs opacity-80">Trending Help</div>
          </div>
        </div>
      </div>

      {/* ROW 1 */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Important For You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.importantAnnouncements.map((a: any) => (
              <div key={a.id} className="border rounded-md p-3">
                <div className="flex justify-between">
                  <p className="font-medium">{a.title}</p>
                  <Badge>{a.priority}</Badge>
                </div>
                <p className="text-sm text-slate-600">{a.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Department Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.upcomingEvents.map((e: any) => (
              <div key={e.id} className="border rounded-md p-3">
                <p className="font-medium">{e.title}</p>
                <p className="text-sm text-slate-600">
                  {new Date(e.startDate).toDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ROW 2 */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Students Are Asking About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.suggestedProcedures.map((p: any) => (
              <div key={p.id} className="border rounded-md p-3">
                <p className="font-medium">{p.title}</p>
                <Badge variant="secondary">{p.code}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Useful Services For You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.suggestedServices.map((s: any) => (
              <div key={s.id} className="border rounded-md p-3">
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ROW 3 */}
      <div className="grid md:grid-cols-2 gap-6">

        <Card>
          <CardHeader>
            <CardTitle>Policies Students Find Confusing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.confusingPolicies.map((p: any) => (
              <div
                key={p.id}
                className="border rounded-md p-3 flex justify-between"
              >
                <p className="font-medium">{p.title}</p>
                <Badge>{p.domain}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* NEW: Your Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.myRecentActivity.length === 0 && (
              <p className="text-sm text-slate-500">
                Your recent assistant questions will appear here.
              </p>
            )}

            {data.myRecentActivity.map((i: any) => (
              <div key={i.id} className="border rounded-md p-3">
                <div className="text-xs text-slate-500">
                  {new Date(i.createdAt).toLocaleString()}
                </div>
                <div className="font-medium">{i.intent}</div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
