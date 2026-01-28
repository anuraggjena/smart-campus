"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function HodAcademicEvents() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "EXAM",
    startDate: "",
    endDate: "",
  });

  async function load() {
    const res = await fetch("/api/hod/academics");
    const d = await res.json();
    setData(d);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/hod/academics", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({
      title: "",
      description: "",
      type: "EXAM",
      startDate: "",
      endDate: "",
    });

    load();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Create Academic Event
          </h2>

          <form onSubmit={submit} className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="border p-2 rounded-md"
            >
              <option value="EXAM">Exam</option>
              <option value="ASSESSMENT">Assessment</option>
              <option value="SCHEDULE">Schedule</option>
            </select>

            <div className="flex gap-3">
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />
            </div>

            <Button type="submit">Add Event</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {data.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-slate-600">
                {e.description}
              </p>
              <p className="text-xs text-slate-400">
                {e.startDate} → {e.endDate}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
