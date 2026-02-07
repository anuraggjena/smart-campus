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

type Department = {
  id: string;
  code: string;
  name: string;
};

export default function AdminMasterDataPage() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  async function load() {
    const o = await fetch("/api/admin/offices").then(r => r.json());
    const d = await fetch("/api/admin/departments").then(r => r.json());
    setOffices(o);
    setDepartments(d);
  }

  useEffect(() => {
    load();
  }, []);

  // -------- OFFICE --------
  async function createOffice(e: any) {
    e.preventDefault();
    const f = e.target;

    await fetch("/api/admin/offices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: f.id.value,
        code: f.code.value,
        name: f.name.value,
      }),
    });

    f.reset();
    load();
  }

  async function deleteOffice(id: string) {
    if (!confirm("Delete this office?")) return;

    await fetch(`/api/admin/offices/${id}`, {
      method: "DELETE",
    });

    load();
  }

  // -------- DEPARTMENT --------
  async function createDepartment(e: any) {
    e.preventDefault();
    const f = e.target;

    await fetch("/api/admin/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: f.id.value,
        code: f.code.value,
        name: f.name.value,
      }),
    });

    f.reset();
    load();
  }

  async function deleteDepartment(id: string) {
    if (!confirm("Delete this department?")) return;

    await fetch(`/api/admin/departments/${id}`, {
      method: "DELETE",
    });

    load();
  }

  return (
    <div className="space-y-10 max-w-5xl">

      {/* ---------------- OFFICES ---------------- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Offices</h2>

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
              <Button type="submit">Create Office</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Existing Offices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {offices.map(o => (
              <div key={o.id} className="flex justify-between border p-3 rounded-md">
                <div>
                  <p className="font-medium">{o.code} — {o.name}</p>
                  <p className="text-xs text-slate-500">{o.id}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteOffice(o.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ---------------- DEPARTMENTS ---------------- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Departments</h2>

        <Card>
          <CardHeader>
            <CardTitle>Create Department</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createDepartment} className="space-y-4">
              <div>
                <Label>ID</Label>
                <Input name="id" placeholder="cse-dept" required />
              </div>
              <div>
                <Label>Code</Label>
                <Input name="code" placeholder="CSE" required />
              </div>
              <div>
                <Label>Name</Label>
                <Input name="name" placeholder="Computer Science Engineering" required />
              </div>
              <Button type="submit">Create Department</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Existing Departments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.map(d => (
              <div key={d.id} className="flex justify-between border p-3 rounded-md">
                <div>
                  <p className="font-medium">{d.code} — {d.name}</p>
                  <p className="text-xs text-slate-500">{d.id}</p>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteDepartment(d.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
