"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function suggestion(item: any) {
  if (item.pci < 50)
    return "Students repeatedly struggle here. Rewrite this document with clearer steps and examples.";
  else if (item.followUps > item.total * 0.4)
    return "Students often ask follow-up questions. Add FAQ or examples to this document.";
  else if (item.lowConfidence > item.total * 0.3)
    return "AI frequently misclassifies this. Add clearer keywords and terminology.";
  else
  return "Minor clarity improvements recommended.";
}

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

  const policies =
    result?.confusingItems.filter((i: any) => i.type === "POLICY") ?? [];
  const procedures =
    result?.confusingItems.filter((i: any) => i.type === "PROCEDURE") ?? [];

  return (
    <div className="space-y-8 max-w-7xl">
      <h1 className="text-2xl font-semibold">
        Domain Clarity Analytics
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Domain</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            placeholder="FEES / EXAMS / HOSTEL / ACADEMICS"
            value={domain}
            onChange={(e) =>
              setDomain(e.target.value.toUpperCase())
            }
          />
          <Button onClick={analyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* PCI RESULT */}
          <Card>
            <CardHeader>
              <CardTitle>Domain PCI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold">
                {result.pci}
              </p>
              <p className="text-sm text-slate-500">
                {result.interactions} interactions
              </p>
            </CardContent>
          </Card>

          {/* SIDE BY SIDE */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* POLICIES */}
            <Card>
              <CardHeader>
                <CardTitle>Confusing Policies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-150 overflow-auto">
                {policies.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No policy clarity issues.
                  </p>
                ) : (
                  policies.map((item: any) => (
                    <div
                      key={item.code}
                      className="border rounded-lg p-4 bg-slate-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            Code: {item.code}
                          </p>
                        </div>
                        <Badge
                          variant={
                            item.pci < 60
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          PCI {item.pci}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 mt-2">
                        {suggestion(item)}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* PROCEDURES */}
            <Card>
              <CardHeader>
                <CardTitle>Confusing Procedures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-150 overflow-auto">
                {procedures.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No procedure clarity issues.
                  </p>
                ) : (
                  procedures.map((item: any) => (
                    <div
                      key={item.code}
                      className="border rounded-lg p-4 bg-slate-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            Code: {item.code}
                          </p>
                        </div>
                        <Badge
                          variant={
                            item.pci < 60
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          PCI {item.pci}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 mt-2">
                        {suggestion(item)}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
