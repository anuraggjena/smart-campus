"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminAnalytics() {
  const [domain, setDomain] = useState("FEES");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function fetchPCI() {
    setLoading(true);
    setResult(null);

    const res = await fetch(
      `/api/admin/analytics/pci/domain?domain=${domain}`
    );
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">
          Policy Clarity Analytics
        </h2>
        <p className="text-sm text-slate-600">
          Identify policies that require better communication or simplification.
        </p>
      </div>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Analyze Policy Domain
          </CardTitle>
          <CardDescription>
            Enter a domain such as FEES, EXAMS, or HOSTEL.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="FEES"
          />
          <Button onClick={fetchPCI} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                PCI Result
              </CardTitle>
              <Badge variant="secondary">
                Domain: {result.domain}
              </Badge>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-3">
            <p className="text-sm">
              <b>Policy Clarity Index:</b>{" "}
              <span className="text-lg font-semibold">
                {result.pci}
              </span>
            </p>

            <p className="text-sm text-slate-600">
              This score reflects how clearly the policy is understood by
              students based on frequency and nature of related queries.
            </p>

            {typeof result.totalQueries === "number" && (
              <div className="text-sm text-slate-600">
                Total related queries: {result.totalQueries}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
