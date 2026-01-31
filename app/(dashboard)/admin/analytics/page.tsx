"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminAnalytics() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!domain) return;
    setLoading(true);

    const res = await fetch(
      `/api/admin/analytics/pci/domain?domain=${domain}`
    );
    const data = await res.json();

    setResult(data);
    setLoading(false);
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-semibold">PCI Domain Analytics</h1>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Domain</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            placeholder="FEES / EXAMS / HOSTEL"
            value={domain}
            onChange={e => setDomain(e.target.value.toUpperCase())}
          />
          <Button onClick={analyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge>Domain: {result.domain}</Badge>
            <p className="text-4xl font-bold">{result.pci}</p>
            <p className="text-sm text-slate-500">
              Total queries: {result.interactions}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
