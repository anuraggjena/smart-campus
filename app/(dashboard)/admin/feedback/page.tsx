"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/admin/feedback")
      .then((res) => res.json())
      .then(setFeedbacks);
  }, []);

  const filtered = useMemo(() => {
        return feedbacks
          .filter((fb) =>
            filter === "ALL" ? true : fb.priority === filter
          );
      }, [feedbacks, filter])

  return (
    <div className="space-y-8">
      <div className="flex gap-3 flex-wrap">
          {["ALL", "HIGH", "MEDIUM", "LOW"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  filter === f
                    ? "bg-slate-900 text-white"
                    : "bg-white"
                }`}
              >
                {f}
              </button>
            )
          )}
        </div>
      <Card>
        <CardHeader>
          <CardTitle>All Campus Feedbacks</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {feedbacks.length === 0 ? (
            <p className="text-sm text-slate-500">
              No feedbacks yet.
            </p>
          ) : (
            filtered.map((f) => (
              <div
                key={f.id}
                className="border rounded-lg p-4 bg-slate-50 space-y-2"
              >
                <div className="flex gap-2 flex-wrap">
                  <Badge>{f.studentName}</Badge>
                  <Badge variant="secondary">
                    {f.department}
                  </Badge>
                  <Badge>{f.sentiment}</Badge>
                  <Badge variant="outline">
                    {f.priority}
                  </Badge>
                </div>

                <p className="text-sm text-slate-700">
                  {f.message}
                </p>

                <p className="text-xs text-slate-400">
                  {new Date(f.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
