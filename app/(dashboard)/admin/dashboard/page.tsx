"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DomainPCI = {
  domain: string;
  pci: number;
  interactions: number;
};

export default function AdminDashboard() {
  const [overallPCI, setOverallPCI] = useState<number>(0);
  const [domains, setDomains] = useState<DomainPCI[]>([]);

  async function fetchDashboard() {
    const res = await fetch("/api/admin/dashboard");
    const data = await res.json();
    setOverallPCI(data.overallPCI);
    setDomains(data.domainPCI);
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  function pciStatus(pci: number) {
    if (pci >= 80) return "Clear";
    if (pci >= 50) return "Needs Attention";
    return "Unclear";
  }

  function pciColor(pci: number) {
    if (pci >= 80) return "bg-green-100 text-green-800";
    if (pci >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-semibold">
        Admin Dashboard
      </h2>

      {/* OVERALL PCI */}
      <Card>
        <CardHeader>
          <CardTitle>Campus Policy Clarity Index</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {overallPCI}
          </p>
          <p className="text-sm text-slate-600">
            Overall clarity across institutional policies
          </p>
        </CardContent>
      </Card>

      {/* DOMAIN PCI */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Clarity by Domain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {domains.length === 0 ? (
            <p className="text-sm text-slate-500">
              No interaction data available yet.
            </p>
          ) : (
            domains.map(d => (
              <div
                key={d.domain}
                className="flex justify-between items-center border p-4 rounded-md"
              >
                <div>
                  <p className="font-medium">{d.domain}</p>
                  <p className="text-sm text-slate-600">
                    {d.interactions} interactions
                  </p>
                </div>

                <Badge className={pciColor(d.pci)}>
                  {d.pci} – {pciStatus(d.pci)}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
