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
  owningOffice: string;
  content: string;
  version: string;
  isActive: boolean;
};

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPolicies() {
    const res = await fetch("/api/admin/policies");
    const data = await res.json();
    setPolicies(data);
  }

  useEffect(() => {
    fetchPolicies();
  }, []);

  async function toggleStatus(id: string, isActive: boolean) {
    await fetch(`/api/admin/policies/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchPolicies();
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
            <div>
              <Label>Policy Code</Label>
              <Input name="code" required />
            </div>

            <div>
              <Label>Version</Label>
              <Input name="version" required />
            </div>

            <div>
              <Label>Title</Label>
              <Input name="title" required />
            </div>

            <div>
              <Label>Owning Office</Label>
              <Input name="owningOffice" required />
            </div>

            <div>
              <Label>Domain</Label>
              <Select name="domain">
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
            </div>

            <div className="md:col-span-2">
              <Label>Policy Content</Label>
              <Input name="content" required />
            </div>

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
          {policies.length === 0 ? (
            <p className="text-sm text-slate-500">
              No policies created yet.
            </p>
          ) : (
            policies.map(p => (
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
                    variant="outline"
                    onClick={() => toggleStatus(p.id, p.isActive)}
                  >
                    {p.isActive ? "Deactivate" : "Activate"}
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
                  {!p.isActive && (
                    <Badge variant="destructive">
                      Inactive
                    </Badge>
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
