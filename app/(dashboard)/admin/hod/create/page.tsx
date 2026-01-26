"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreateHODPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.target;

    const res = await fetch("/api/admin/hod/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        departmentId: form.departmentId.value,
        password: form.password.value,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setMessage("HOD created successfully");
      form.reset();
    } else {
      setMessage("Failed to create HOD");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create HOD Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input name="name" required />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" name="email" required />
            </div>

            <div>
              <Label>Department</Label>
              <Input name="department" required />
            </div>

            <div>
              <Label>Temporary Password</Label>
              <Input type="password" name="password" required />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create HOD"}
            </Button>

            {message && (
              <p className="text-sm text-center">{message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
