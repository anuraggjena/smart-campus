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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Department = {
  id: string;
  code: string;
  name: string;
};

type HodUser = {
  id: string;
  name: string;
  email: string;
  departmentName: string;
};

export default function AdminHodManagementPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [hods, setHods] = useState<HodUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments
  async function fetchDepartments() {
    const res = await fetch("/api/admin/departments");
    const data = await res.json();
    setDepartments(data);
  }

  // Fetch existing HODs
  async function fetchHods() {
    const res = await fetch("/api/admin/hods");
    const data = await res.json();
    setHods(data);
  }

  useEffect(() => {
    fetchDepartments();
    fetchHods();
  }, []);

  async function handleCreate(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    await fetch("/api/admin/create-hod", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
        departmentId: form.departmentId.value,
      }),
    });

    form.reset();
    setLoading(false);
    fetchHods();
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-semibold">HOD Management</h2>

      {/* Create HOD */}
      <Card>
        <CardHeader>
          <CardTitle>Create HOD Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <Label>Name</Label>
              <Input name="name" required />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" name="email" required />
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" name="password" required />
            </div>

            <div>
              <Label>Department</Label>
              <Select name="departmentId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.code} — {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create HOD"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing HODs */}
      <Card>
        <CardHeader>
          <CardTitle>Existing HOD Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hods.length === 0 ? (
            <p className="text-sm text-slate-500">
              No HOD accounts created yet.
            </p>
          ) : (
            hods.map((h) => (
              <div
                key={h.id}
                className="border p-4 rounded-md"
              >
                <p className="font-medium">{h.name}</p>
                <p className="text-sm text-slate-600">
                  {h.email}
                </p>
                <p className="text-sm text-slate-500">
                  Department: {h.departmentName}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
