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

type Policy = {
  id: string;
  code: string;
  title: string;
  domain: string;
  content: string;
  version: string;
  isActive: boolean;
  officeName: string; // coming from API join
};

type Office = {
  id: string;
  name: string;
};

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPolicies() {
    const res = await fetch("/api/admin/policies");
    const data = await res.json();
    setPolicies(data);
  }

  async function fetchOffices() {
    const res = await fetch("/api/admin/offices");
    const data = await res.json();
    setOffices(data);
  }

  async function load() {
    const a = await fetch("/api/admin/policies").then(r => r.json());
    const d = await fetch("/api/offices").then(r => r.json());
    setPolicies(a);
    setOffices(d);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    fetchPolicies();
    fetchOffices();
  }, []);

  async function deletePolicy(id: string) {
    const ok = confirm("Delete this policy?");
    if (!ok) return;

    await fetch(`/api/admin/policies/${id}`, {
      method: "DELETE",
    });

    load();
  }

  async function handleCreate(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    await fetch("/api/admin/policies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.value,
        title: form.title.value,
        domain: form.domain.value,
        owningOffice: form.owningOffice.value,
        content: form.content.value,
        version: form.version.value,
      }),
    });

    form.reset();
    setLoading(false);
    fetchPolicies();
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-semibold">
        Policies & Rules Management
      </h2>

      {/* CREATE POLICY */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input name="code" placeholder="Policy Code" required />
            <Input name="version" placeholder="Version" required />
            <Input name="title" placeholder="Title" required />

            <Select name="owningOffice" required>
              <SelectTrigger>
                <SelectValue placeholder="Select owning office" />
              </SelectTrigger>
              <SelectContent>
                {offices.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="domain" required>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEES">Fees</SelectItem>
                <SelectItem value="EXAMS">Exams</SelectItem>
                <SelectItem value="HOSTEL">Hostel</SelectItem>
                <SelectItem value="ACADEMICS">Academics</SelectItem>
                <SelectItem value="GENERAL">General</SelectItem>
              </SelectContent>
            </Select>

            <Input
              name="content"
              placeholder="Policy content"
              className="md:col-span-2"
              required
            />

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Policy"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* POLICIES LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {policies.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded-md space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {p.code} — {p.title}
                </p>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletePolicy(p.id)}
                >
                  Delete
                </Button>
              </div>

              <p className="text-sm text-slate-600">
                {p.content}
              </p>

              <div className="flex gap-2 flex-wrap">
                <Badge>{p.domain}</Badge>
                <Badge variant="secondary">
                  v{p.version}
                </Badge>
                <Badge variant="outline">
                  {p.officeName}
                </Badge>
                {!p.isActive && (
                  <Badge variant="destructive">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
