"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Announcement = {
  id: string;
  title: string;
  message: string;
  priority: string;
  activeFrom: string;
  activeUntil: string | null;
  isActive: boolean;
};

export default function HodAnnouncementsPage() {
  const [data, setData] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Announcement | null>(null);

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

  function resetForm() {
    setForm({
      title: "",
      message: "",
      priority: "NORMAL",
      activeFrom: "",
      activeUntil: "",
    });
    setEditing(null);
  }

  async function submit(e: any) {
  e.preventDefault();

  const payload = {
    ...form,
    activeFrom: new Date(form.activeFrom).toISOString(),
    activeUntil: form.activeUntil
      ? new Date(form.activeUntil).toISOString()
      : null,
  };

  if (editing) {
    await fetch(`/api/hod/announcements/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } else {
    await fetch("/api/hod/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  }

  resetForm();
  load();
}

  async function toggleStatus(a: Announcement) {
    await fetch(`/api/hod/announcements/${a.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !a.isActive }),
    });

    load();
  }

  function startEdit(a: Announcement) {
    setEditing(a);
    setForm({
      title: a.title,
      message: a.message,
      priority: a.priority,
      activeFrom: a.activeFrom,
      activeUntil: a.activeUntil ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getStatus(a: Announcement) {
    const now = new Date();
    const until = a.activeUntil ? new Date(a.activeUntil) : null;

    if (!a.isActive) return "Inactive";
    if (until && until < now) return "Expired";
    return "Active";
  }

  return (
    <div className="space-y-8 max-w-5xl">

      {/* CREATE / EDIT */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            {editing ? "Edit Announcement" : "Create Department Announcement"}
          </h2>

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

            <div className="flex gap-3">
              <Button type="submit">
                {editing ? "Update" : "Post Announcement"}
              </Button>

              {editing && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ANNOUNCEMENT MANAGER */}
      <div className="space-y-4">
        {data.map((a) => (
          <Card key={a.id}>
            <CardContent className="p-5 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{a.title}</h3>

                <div className="flex gap-2 items-center">
                  <Badge>{a.priority}</Badge>
                  <Badge variant="secondary">{getStatus(a)}</Badge>
                </div>
              </div>

              <p className="text-sm text-slate-600">{a.message}</p>

              <div className="text-xs text-slate-400">
                From {new Date(a.activeFrom).toLocaleString()}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(a)}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await fetch(`/api/hod/announcements/${a.id}`, {
                      method: "DELETE",
                    });
                    load();
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
