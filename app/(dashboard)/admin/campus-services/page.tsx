"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CampusServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);

  async function load() {
    const s = await fetch("/api/admin/campus-services").then(r => r.json());
    const o = await fetch("/api/offices").then(r => r.json());
    setServices(s);
    setOffices(o);
  }

  useEffect(() => {
    load();
  }, []);

  async function createService(e: any) {
    e.preventDefault();
    const f = e.target;

    await fetch("/api/admin/campus-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.name.value,
        description: f.description.value,
        category: f.category.value,
        owningOffice: f.office.value,
        visibility: f.visibility.value,
      }),
    });

    f.reset();
    load();
  }

  async function deleteService(id: string) {
    const ok = confirm("Delete this service?");
    if (!ok) return;

    await fetch(`/api/admin/campus-services/${id}`, {
      method: "DELETE",
    });

    load();
  }

  return (
    <div className="space-y-8 max-w-5xl">

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Create Campus Service</h2>

          <form onSubmit={createService} className="grid gap-3">
            <Input name="name" placeholder="Service Name" required />
            <Input name="description" placeholder="Description" required />

            <select name="category" className="border p-2 rounded">
              <option value="HOSTEL">Hostel</option>
              <option value="TRANSPORT">Transport</option>
              <option value="FEES">Fees</option>
              <option value="SCHOLARSHIP">Scholarship</option>
              <option value="LIBRARY">Library</option>
              <option value="GENERAL">General</option>
            </select>

            <select name="office" className="border p-2 rounded">
              {offices.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.code} — {o.name}
                </option>
              ))}
            </select>

            <select name="visibility" className="border p-2 rounded">
              <option value="ALL_STUDENTS">All Students</option>
              <option value="HOSTELLERS_ONLY">Hostellers Only</option>
            </select>

            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {services.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 flex justify-between">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-slate-600">{s.description}</p>
              </div>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteService(s.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
