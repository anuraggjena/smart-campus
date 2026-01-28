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
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Create Announcement</h2>

          <form onSubmit={submit} className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <Textarea
              placeholder="Message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <div className="flex gap-3">
              <Input
                type="datetime-local"
                value={form.activeFrom}
                onChange={(e) =>
                  setForm({ ...form, activeFrom: e.target.value })
                }
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

      <div className="space-y-3">
        {data.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-4">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-slate-600">
                {a.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
