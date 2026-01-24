"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function StudentRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
        department: form.department.value,
        isHosteller: form.isHosteller.checked,
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
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
              <Label>Password</Label>
              <Input type="password" name="password" required />
            </div>

            <div>
              <Label>Department</Label>
              <Input name="department" required />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="isHosteller" name="isHosteller" />
              <Label htmlFor="isHosteller">
                I am a hosteller
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
