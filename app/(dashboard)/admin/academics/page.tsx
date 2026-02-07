"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AdminAcademicEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  async function load() {
    const res = await fetch("/api/admin/academics");
    setEvents(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/academics", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    });

    load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/academics/${id}`, {
      method: "DELETE",
    });
    load();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Create Campus Event</h2>

          <form onSubmit={submit} className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <Input
              type="date"
              value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })}
            />
            <Input
              type="date"
              value={form.endDate}
              onChange={e => setForm({ ...form, endDate: e.target.value })}
            />
            <Button type="submit">Add Event</Button>
          </form>
        </CardContent>
      </Card>

      {events.map(e => (
        <Card key={e.id}>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="text-sm text-slate-600">{e.description}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => remove(e.id)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
