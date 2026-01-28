"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Feedback = {
  id: string;
  message: string;
  createdAt: string;
};

export default function HodFeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [pci, setPci] = useState<number>(100);

  useEffect(() => {
    fetch("/api/hod/feedback")
      .then((res) => res.json())
      .then((data) => {
        setFeedback(data.feedback);
        setPci(data.pci);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* PCI Card */}
      <Card className="bg-linear-to-r from-slate-900 to-slate-700 text-white shadow-lg">
        <CardHeader>
          <CardTitle>Department Process Confidence Index (PCI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold">{pci}%</div>
          <p className="text-sm mt-2 opacity-80">
            Indicates how smoothly students are navigating institutional processes.
          </p>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Feedback from Your Department</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedback.length === 0 && (
            <p className="text-slate-500">No feedback submitted yet.</p>
          )}

          {feedback.map((fb) => (
            <div
              key={fb.id}
              className="border rounded-lg p-4 shadow-sm bg-slate-50"
            >
              <p className="text-sm text-slate-700">{fb.message}</p>
              <p className="text-xs text-slate-400 mt-2">
                {new Date(fb.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
