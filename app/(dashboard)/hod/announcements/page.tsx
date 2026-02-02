"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function HodAnnouncementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    message: "",
    priority: "NORMAL",
    activeFrom: "",
    activeUntil: "",
  });

  async function load() {
    const res = await fetch("/api/hod/announcements");
    const d = await res.json();
    setData(d);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/hod/announcements", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({
      title: "",
      message: "",
      priority: "NORMAL",
      activeFrom: "",
      activeUntil: "",
    });

    load();
  }

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Create Announcement */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Create Department Announcement</h2>

          <form onSubmit={submit} className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <Textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              required
            />

            {/* Priority */}
            <select
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
              className="border p-2 rounded-md w-full"
            >
              <option value="NORMAL">Normal</option>
              <option value="IMPORTANT">Important</option>
              <option value="URGENT">Urgent</option>
            </select>

            {/* Dates */}
            <div className="flex gap-3">
              <Input
                type="datetime-local"
                value={form.activeFrom}
                onChange={(e) =>
                  setForm({ ...form, activeFrom: e.target.value })
                }
                required
              />

              <Input
                type="datetime-local"
                value={form.activeUntil}
                onChange={(e) =>
                  setForm({ ...form, activeUntil: e.target.value })
                }
              />
            </div>

            <Button type="submit">Post Announcement</Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Announcements */}
      <div className="space-y-3">
        {data.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <h3 className="font-semibold">{a.title}</h3>
                <span className="text-xs px-2 py-1 bg-slate-200 rounded">
                  {a.priority}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">
                {a.message}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Active from {new Date(a.activeFrom).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
