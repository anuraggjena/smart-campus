"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DomainPCI = {
  domain: string;
  pci: number;
  interactions: number;
};

type DeptPCI = {
  department: string;
  pci: number;
  interactions: number;
};

export default function AdminDashboard() {
  const [overallPCI, setOverallPCI] = useState(0);
  const [domains, setDomains] = useState<DomainPCI[]>([]);
  const [departments, setDepartments] = useState<DeptPCI[]>([]);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(res => res.json())
      .then(data => {
        setOverallPCI(data.overallPCI);
        setDomains(data.domainPCI || []);
        setDepartments(data.departmentPCI || []);
      });
  }, []);

  const pciColor = (pci: number) => {
    if (pci >= 80) return "bg-green-100 text-green-700";
    if (pci >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* Overall PCI */}
      <Card>
        <CardHeader>
          <CardTitle>Campus Process Clarity Index</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold">{overallPCI}</p>
          <p className="text-sm text-slate-500">
            Overall institutional clarity based on student queries
          </p>
        </CardContent>
      </Card>

      {/* Domain PCI */}
      <Card>
        <CardHeader>
          <CardTitle>PCI by Domain</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {domains.map(d => (
            <div
              key={d.domain}
              className="flex justify-between items-center border rounded-lg p-4"
            >
              <div>
                <p className="font-medium">{d.domain}</p>
                <p className="text-xs text-slate-500">
                  {d.interactions} interactions
                </p>
              </div>
              <Badge className={pciColor(d.pci)}>{d.pci}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Department PCI */}
      <Card>
        <CardHeader>
          <CardTitle>PCI by Department</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {departments.map(d => (
            <div
              key={d.department}
              className="flex justify-between items-center border rounded-lg p-4"
            >
              <div>
                <p className="font-medium">{d.department}</p>
                <p className="text-xs text-slate-500">
                  {d.interactions} interactions
                </p>
              </div>
              <Badge className={pciColor(d.pci)}>{d.pci}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
