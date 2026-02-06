"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: string;
  departmentId: string | null;
  priority: string;
  activeFrom: string;
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const a = await fetch("/api/admin/announcements").then(r => r.json());
    const d = await fetch("/api/departments").then(r => r.json());
    setAnnouncements(a);
    setDepartments(d);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteAnnouncement(id: string) {
    const ok = confirm("Delete this announcement?");
    if (!ok) return;

    await fetch(`/api/admin/announcements/${id}`, {
      method: "DELETE",
    });

    load();
  }

  async function handleCreate(e: any) {
    e.preventDefault();
    setLoading(true);

    const f = e.target;

    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: f.title.value,
        message: f.message.value,
        audience: f.audience.value,
        departmentId: f.departmentId.value || null,
        priority: f.priority.value,
        activeFrom: f.activeFrom.value,
        activeUntil: f.activeUntil.value || null,
      }),
    });

    f.reset();
    setLoading(false);
    load();
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-semibold">College Announcements</h2>

      {/* CREATE */}
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-4">
            <Input name="title" placeholder="Title" required />

            <select name="audience" className="border p-2 rounded">
              <option value="ALL">All Students</option>
              <option value="HOSTELLERS_ONLY">Hostellers Only</option>
              <option value="DEPARTMENT_ONLY">Department Only</option>
            </select>

            <select name="departmentId" className="border p-2 rounded">
              <option value="">None</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} — {d.name}
                </option>
              ))}
            </select>

            <select name="priority" className="border p-2 rounded">
              <option value="NORMAL">Normal</option>
              <option value="IMPORTANT">Important</option>
              <option value="URGENT">Urgent</option>
            </select>

            <Input name="message" placeholder="Message" required />

            <Input type="date" name="activeFrom" required />
            <Input type="date" name="activeUntil" />

            <Button type="submit">
              {loading ? "Publishing..." : "Publish"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="border p-4 rounded-md">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-sm text-slate-600">{a.message}</p>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteAnnouncement(a.id)}
                >
                  Delete
                </Button>
              </div>

              <div className="flex gap-2 mt-2">
                <Badge>{a.audience}</Badge>
                <Badge variant="secondary">{a.priority}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
