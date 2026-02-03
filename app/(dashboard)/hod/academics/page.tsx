"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function HodAcademicEvents() {
  const [data, setData] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  const emptyForm = {
    title: "",
    description: "",
    type: "EXAM",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState(emptyForm);

  async function load() {
    const res = await fetch("/api/hod/academics");
    setData(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(event: any) {
    setEditing(event);
    setForm(event);
  }

  async function submit(e: any) {
    e.preventDefault();

    if (editing) {
      await fetch(`/api/hod/academics/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setEditing(null);
    } else {
      await fetch("/api/hod/academics", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    setForm(emptyForm);
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/hod/academics/${id}`, {
      method: "DELETE",
    });
    load();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            {editing ? "Edit Academic Event" : "Create Academic Event"}
          </h2>

          <form onSubmit={submit} className="space-y-3">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />

            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
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
                required
              />
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />
            </div>

            <Button type="submit">
              {editing ? "Update Event" : "Add Event"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {data.map((e) => (
          <Card key={e.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-sm text-slate-600">
                  {e.description}
                </p>
                <p className="text-xs text-slate-400">
                  {e.startDate} → {e.endDate}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(e)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => remove(e.id)}
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
