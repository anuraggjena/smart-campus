"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Event = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
};

export default function StudentEventsPage() {
  const [tab, setTab] = useState<"DEPT" | "CAMPUS">("DEPT");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch(`/api/student/events?type=${tab}`)
      .then(res => res.json())
      .then(setEvents);
  }, [tab]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Academic Events</h1>

      <div className="flex gap-3">
        <Button
          variant={tab === "DEPT" ? "default" : "outline"}
          onClick={() => setTab("DEPT")}
        >
          Department Events
        </Button>

        <Button
          variant={tab === "CAMPUS" ? "default" : "outline"}
          onClick={() => setTab("CAMPUS")}
        >
          Campus Events
        </Button>
      </div>

      <div className="space-y-4">
        {events.map(e => (
          <Card key={e.id}>
            <CardContent className="p-4">
              <p className="font-medium">{e.title}</p>
              <p className="text-sm text-slate-600">{e.description}</p>
              <p className="text-xs text-slate-400 mt-2">
                {new Date(e.startDate).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
