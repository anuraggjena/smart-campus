"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HodDashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hod/dashboard")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading department insights...</div>;

  function pciColor(pci: number) {
    if (pci >= 80) return "bg-green-100 text-green-800";
    if (pci >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Top PCI Card */}
      <Card className="bg-linear-to-r from-slate-900 to-slate-700 text-white shadow-lg">
        <CardHeader>
          <CardTitle>Department Process Clarity Index (PCI)</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>
            <div className="text-5xl font-bold">{data.overallPCI}%</div>
            <p className="text-sm opacity-80 mt-2">
              Based on how clearly students understand campus processes.
            </p>
          </div>

          {/* 🔥 Action buttons */}
          <div className="flex gap-3">
            <Link href="/hod/announcements">
              <Button variant="secondary">Post Announcement</Button>
            </Link>

            <Link href="/hod/academics">
              <Button variant="secondary">Add Academic Event</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Domain PCI */}
      <Card>
        <CardHeader>
          <CardTitle>PCI by Domain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.domainPCI.map((d: any) => (
            <div
              key={d.domain}
              className="flex justify-between items-center border p-4 rounded-md"
            >
              <div>
                <p className="font-medium">{d.domain}</p>
                <p className="text-sm text-slate-500">
                  {d.interactions} student queries
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className={pciColor(d.pci)}>
                  {d.pci}%
                </Badge>

                {/* 🔥 Contextual actions */}
                {d.domain === "EXAMS" || d.domain === "ACADEMICS" ? (
                  <Link href="/hod/academics">
                    <Button size="sm" variant="outline">
                      Fix via Event
                    </Button>
                  </Link>
                ) : (
                  <Link href="/hod/announcements">
                    <Button size="sm" variant="outline">
                      Clarify via Notice
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Total interactions */}
      <Card>
        <CardHeader>
          <CardTitle>Total Student Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{data.interactions}</div>
          <p className="text-sm text-slate-500">
            Total interactions from your department
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
