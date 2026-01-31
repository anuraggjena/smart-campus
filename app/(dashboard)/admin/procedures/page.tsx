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

type Procedure = {
  id: string;
  code: string;
  title: string;
  domain: string;
  stepsJson: string;
  isActive: boolean;
  officeName: string;
};

type Office = {
  id: string;
  name: string;
};

export default function AdminProceduresPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);

  async function fetchProcedures() {
    const res = await fetch("/api/admin/procedures");
    const data = await res.json();
    setProcedures(data);
  }

  async function fetchOffices() {
    const res = await fetch("/api/admin/offices");
    const data = await res.json();
    setOffices(data);
  }

  useEffect(() => {
    fetchProcedures();
    fetchOffices();
  }, []);

  function updateStep(index: number, value: string) {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  }

  function addStep() {
    setSteps([...steps, ""]);
  }

  async function toggleStatus(id: string, isActive: boolean) {
    await fetch(`/api/admin/procedures/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchProcedures();
  }

  async function handleCreate(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    await fetch("/api/admin/procedures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.value,
        title: form.title.value,
        domain: form.domain.value,
        owningOffice: form.owningOffice.value,
        steps,
      }),
    });

    form.reset();
    setSteps([""]);
    setLoading(false);
    fetchProcedures();
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-semibold">
        Procedures Management
      </h2>

      {/* CREATE PROCEDURE */}
      <Card>
        <CardHeader>
          <CardTitle>Create Procedure</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreate}
            className="grid gap-4"
          >
            <Input name="code" placeholder="Procedure Code" required />
            <Input name="title" placeholder="Title" required />

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

            <div className="space-y-2">
              <Label>Steps</Label>
              {steps.map((step, i) => (
                <Input
                  key={i}
                  value={step}
                  onChange={(e) =>
                    updateStep(i, e.target.value)
                  }
                  placeholder={`Step ${i + 1}`}
                  required
                />
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addStep}
              >
                + Add Step
              </Button>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Procedure"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Procedures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {procedures.map((p) => (
            <div
              key={p.id}
              className="border p-4 rounded-md space-y-2"
            >
              <div className="flex justify-between">
                <p className="font-medium">
                  {p.code} — {p.title}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    toggleStatus(p.id, p.isActive)
                  }
                >
                  {p.isActive ? "Deactivate" : "Activate"}
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Badge>{p.domain}</Badge>
                <Badge variant="secondary">
                  {p.officeName}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
