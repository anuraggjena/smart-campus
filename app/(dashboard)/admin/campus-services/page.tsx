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

type CampusService = {
  id: string;
  name: string;
  description: string;
  category: string;
  visibility: string;
  isActive: boolean;
  officeName: string;
};

type Office = {
  id: string;
  name: string;
};

export default function AdminCampusServicesPage() {
  const [services, setServices] = useState<CampusService[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchServices() {
    const res = await fetch("/api/admin/campus-services");
    const data = await res.json();
    setServices(data);
  }

  async function fetchOffices() {
    const res = await fetch("/api/admin/offices");
    const data = await res.json();
    setOffices(data);
  }

  useEffect(() => {
    fetchServices();
    fetchOffices();
  }, []);

  async function toggleStatus(id: string, isActive: boolean) {
    await fetch(`/api/admin/campus-services/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchServices();
  }

  async function handleCreate(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = e.target;

    await fetch("/api/admin/campus-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name.value,
        description: form.description.value,
        category: form.category.value,
        owningOfficeId: form.owningOfficeId.value,
        visibility: form.visibility.value,
      }),
    });

    form.reset();
    setLoading(false);
    fetchServices();
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-semibold">
        Campus Services Management
      </h2>

      {/* CREATE SERVICE */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Service</CardTitle>
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
              <Label>Owning Office</Label>
              <Select name="owningOfficeId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select office" />
                </SelectTrigger>
                <SelectContent>
                  {offices.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Description</Label>
              <Input name="description" required />
            </div>

            <div>
              <Label>Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOSTEL">Hostel</SelectItem>
                  <SelectItem value="TRANSPORT">Transport</SelectItem>
                  <SelectItem value="FEES">Fees</SelectItem>
                  <SelectItem value="SCHOLARSHIP">Scholarship</SelectItem>
                  <SelectItem value="LIBRARY">Library</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Visibility</Label>
              <Select name="visibility">
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_STUDENTS">
                    All Students
                  </SelectItem>
                  <SelectItem value="HOSTELLERS_ONLY">
                    Hostellers Only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Service"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* SERVICES LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border p-4 rounded-md"
            >
              <div>
                <p className="font-medium">{service.name}</p>
                <p className="text-sm text-slate-600">
                  {service.description}
                </p>

                <div className="flex gap-2 mt-2">
                  <Badge>{service.category}</Badge>
                  <Badge variant="outline">
                    {service.visibility}
                  </Badge>
                  <Badge variant="secondary">
                    {service.officeName}
                  </Badge>
                  {!service.isActive && (
                    <Badge variant="destructive">
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() =>
                  toggleStatus(service.id, service.isActive)
                }
              >
                {service.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
