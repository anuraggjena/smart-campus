"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function StudentAssistant() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<null | {
    intent: string;
    confidence: number;
    answer: string;
  }>(null);
  const [loading, setLoading] = useState(false);

  async function submitQuery() {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/student/assistant/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">
          AI Campus Assistant
        </h2>
        <p className="text-sm text-slate-600">
          Ask questions about academic rules, fees, hostel policies, or campus
          procedures.
        </p>
      </div>

      {/* Query Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Your Question
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. What happens if I miss my fee payment deadline?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            rows={4}
          />
          <Button onClick={submitQuery} disabled={loading}>
            {loading ? "Analyzing..." : "Ask Assistant"}
          </Button>
        </CardContent>
      </Card>

      {/* Response */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Assistant Response
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  Intent: {result.intent}
                </Badge>
                <Badge variant="outline">
                  Confidence: {result.confidence}%
                </Badge>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent>
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {result.answer}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
