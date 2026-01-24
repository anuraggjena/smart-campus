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

export default function HodDashboard() {
  const [department, setDepartment] = useState("");
  const [overallPCI, setOverallPCI] = useState(0);
  const [domains, setDomains] = useState<DomainPCI[]>([]);

  async function fetchDashboard() {
    const res = await fetch("/api/hod/dashboard");
    const data = await res.json();
    setDepartment(data.department);
    setOverallPCI(data.overallPCI);
    setDomains(data.domainPCI);
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  function status(pci: number) {
    if (pci >= 80) return "Clear";
    if (pci >= 50) return "Needs Attention";
    return "Unclear";
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <h2 className="text-2xl font-semibold">
        {department} Department Dashboard
      </h2>

      <Card>
        <CardHeader>
          <CardTitle>
            Department Policy Clarity Index
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {overallPCI}
          </p>
          <p className="text-sm text-slate-600">
            Clarity across student interactions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Domain-wise Clarity
          </CardTitle>
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
                  <p className="font-medium">
                    {d.domain}
                  </p>
                  <p className="text-sm text-slate-600">
                    {d.interactions} interactions
                  </p>
                </div>

                <Badge>
                  {d.pci} – {status(d.pci)}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
