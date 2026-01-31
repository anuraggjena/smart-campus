"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: string;
  departmentId: string | null;
  priority: string;
  activeFrom: string;
  activeUntil: string | null;
  isActive: boolean;
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<
  { id: string; code: string; name: string }[]>([]);

  async function fetchAnnouncements() {
    const res = await fetch("/api/admin/announcements");
    const data = await res.json();
    setAnnouncements(data);
  }

  async function fetchDepartments() {
    const res = await fetch("/api/departments"); // simple public route
    const data = await res.json();
    setDepartments(data);
  }

  useEffect(() => {
    fetchAnnouncements();
    fetchDepartments();
  }, []);

  async function toggleStatus(id: string, isActive: boolean) {
    await fetch(`/api/admin/announcements/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchAnnouncements();
  }

  async function handleCreate(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title.value,
        message: form.message.value,
        audience: form.audience.value,
        departmentId: form.departmentId.value || null,
        priority: form.priority.value,
        activeFrom: form.activeFrom.value,
        activeUntil: form.activeUntil.value || null,
      }),
    });

    form.reset();
    setLoading(false);
    fetchAnnouncements();
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-semibold">
        College Announcements
      </h2>

      {/* CREATE ANNOUNCEMENT */}
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <Label>Title</Label>
              <Input name="title" required />
            </div>

            {/* Audience */}
            <div>
              <Label>Audience</Label>
              <select name="audience" className="w-full border p-2 rounded">
                <option value="ALL_STUDENTS">All Students</option>
                <option value="HOSTELLERS_ONLY">Hostellers Only</option>
                <option value="DEPARTMENT_ONLY">Department Only</option>
              </select>
            </div>

            {/* Department (only used if DEPARTMENT_ONLY) */}
            <div>
              <Label>Department (if department only)</Label>
              <select
                name="departmentId"
                className="w-full border p-2 rounded"
                defaultValue=""
              >
                <option value="">None</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Priority</Label>
              <select name="priority" className="w-full border p-2 rounded">
                <option value="NORMAL">Normal</option>
                <option value="IMPORTANT">Important</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <Label>Message</Label>
              <Input name="message" required />
            </div>

            <div>
              <Label>Active From</Label>
              <Input type="date" name="activeFrom" required />
            </div>

            <div>
              <Label>Active Until (optional)</Label>
              <Input type="date" name="activeUntil" />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* ANNOUNCEMENTS LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-sm text-slate-500">
              No announcements published yet.
            </p>
          ) : (
            announcements.map(a => (
              <div
                key={a.id}
                className="border p-4 rounded-md space-y-2"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{a.title}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleStatus(a.id, a.isActive)}
                  >
                    {a.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>

                <p className="text-sm text-slate-600">{a.message}</p>

                <div className="flex gap-2 flex-wrap">
                  <Badge>{a.audience}</Badge>
                  <Badge variant="secondary">{a.priority}</Badge>
                  {!a.isActive && (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
