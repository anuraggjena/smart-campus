"use client";

import { useState } from "react";

type AIResponse = {
  intent: string;
  confidence: number;
  answer: string;
};

export default function StudentAssistantPage() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!query) return;

    setLoading(true);
    setResponse(null);

    const res = await fetch("/api/student/assistant/query", {
      method: "POST",
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    setResponse(data);
    setLoading(false);
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[75vh]">
      {/* Chat section */}
      <div className="md:col-span-2 flex flex-col border rounded-xl shadow-sm bg-white">
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold">AI Campus Assistant</h1>
          <p className="text-xs text-slate-500">
            Ask anything about policies, procedures, exams, fees, hostel
          </p>
        </div>

        <div className="flex-1 p-4 overflow-auto space-y-4">
          {response && (
            <div className="bg-slate-50 p-4 rounded-lg border">
              <p className="text-sm whitespace-pre-line">
                {response.answer}
              </p>
            </div>
          )}

          {!response && !loading && (
            <div className="text-sm text-slate-400">
              Start by asking a question…
            </div>
          )}

          {loading && (
            <div className="text-sm text-slate-500">
              Thinking…
            </div>
          )}
        </div>

        <div className="p-4 border-t flex gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. How do I apply for leave?"
            className="flex-1 border rounded-md px-3 py-2 text-sm"
          />
          <button
            onClick={askAI}
            className="bg-slate-900 text-white px-4 rounded-md"
          >
            Ask
          </button>
        </div>
      </div>

      {/* Intelligence panel */}
      <div className="border rounded-xl shadow-sm bg-white p-4 space-y-4">
        <h2 className="text-sm font-semibold text-slate-600">
          AI Analysis
        </h2>

        {response ? (
          <>
            <div>
              <div className="text-xs text-slate-500">Detected Intent</div>
              <div className="font-medium">{response.intent}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Confidence</div>
              <div className="font-medium">
                {response.confidence}%
              </div>
            </div>

            <div className="text-xs text-slate-500">
              This interaction is recorded for campus analytics and PCI.
            </div>
          </>
        ) : (
          <div className="text-xs text-slate-400">
            AI insights will appear here after you ask a question.
          </div>
        )}
      </div>
    </div>
  );
}
