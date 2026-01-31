"use client";

import { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Office = {
  id: string;
  code: string;
  name: string;
};

export default function AdminOfficesPage() {
  const [offices, setOffices] = useState<Office[]>([]);

  async function fetchOffices() {
    const res = await fetch("/api/admin/offices");
    setOffices(await res.json());
  }

  useEffect(() => {
    fetchOffices();
  }, []);

  async function createOffice(e: any) {
    e.preventDefault();
    const form = e.target;

    await fetch("/api/admin/offices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: form.id.value,
        code: form.code.value,
        name: form.name.value,
      }),
    });

    form.reset();
    fetchOffices();
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-semibold">Offices</h2>

      <Card>
        <CardHeader>
          <CardTitle>Create Office</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createOffice} className="space-y-4">
            <div>
              <Label>ID</Label>
              <Input name="id" placeholder="acc-office" required />
            </div>
            <div>
              <Label>Code</Label>
              <Input name="code" placeholder="ACC" required />
            </div>
            <div>
              <Label>Name</Label>
              <Input name="name" placeholder="Accounts Office" required />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Offices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {offices.map(o => (
            <div key={o.id} className="border p-3 rounded-md">
              <p className="font-medium">
                {o.code} — {o.name}
              </p>
              <p className="text-xs text-slate-500">{o.id}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
