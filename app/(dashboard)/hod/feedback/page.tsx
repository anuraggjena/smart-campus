"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Feedback = {
  id: string;
  message: string;
  sentiment: string;
  priority: string;
  studentName: string;
  createdAt: string;
};

export default function HodFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<string>("ALL");


  useEffect(() => {
    fetch("/api/hod/feedback")
      .then((res) => res.json())
      .then((data) => {
        setFeedback(data.feedback);
      });
  }, []);

  const filtered = useMemo(() => {
      return feedback
        .filter((fb) =>
          filter === "ALL" ? true : fb.priority === filter
        );
    }, [feedback, filter])

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
          {["ALL", "HIGH", "MEDIUM", "LOW"].map(
            (fb) => (
              <button
                key={fb}
                onClick={() => setFilter(fb)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  filter === fb
                    ? "bg-slate-900 text-white"
                    : "bg-white"
                }`}
              >
                {fb}
              </button>
            )
          )}
        </div>
      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Feedback from Your Department</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.length === 0 && (
            <p className="text-slate-500">No feedback submitted yet.</p>
          )}

          {filtered.map((fb) => (
              <div
                key={fb.id}
                className="border rounded-lg p-4 bg-slate-50 space-y-2"
              >
                <div className="flex gap-2 flex-wrap">
                  <Badge>{fb.studentName}</Badge>
                  <Badge>{fb.sentiment}</Badge>
                  <Badge variant="outline">
                    {fb.priority}
                  </Badge>
                </div>

                <p className="text-sm text-slate-700">
                  {fb.message}
                </p>

                <p className="text-xs text-slate-400">
                  {new Date(fb.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
