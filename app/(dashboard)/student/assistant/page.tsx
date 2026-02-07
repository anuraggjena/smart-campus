"use client";

import { useState } from "react";

type AIResponse = {
  intent: string;
  confidence: number;
  policies: { id: string; title: string }[];
  procedures: { id: string; title: string }[];
};

type Message =
  | { role: "user"; text: string }
  | { role: "ai"; data: AIResponse };

export default function StudentAssistantPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function askAI() {
    if (!query.trim()) return;

    const userMessage: Message = { role: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    const res = await fetch("/api/student/assistant/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data: AIResponse = await res.json();

    const aiMessage: Message = {
      role: "ai",
      data,
    };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 h-[78vh]">
      {/* Chat Section */}
      <div className="md:col-span-2 flex flex-col border rounded-2xl shadow-sm bg-white overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b bg-linear-to-r from-indigo-600 to-slate-800 text-white">
          <h1 className="text-lg font-semibold">Campus AI Assistant</h1>
          <p className="text-xs opacity-80">
            Ask about policies, procedures, exams, fees, hostel, academics
          </p>
        </div>

        {/* Chat Window */}
        <div className="flex-1 p-6 overflow-auto space-y-4 bg-slate-50">
          {messages.length === 0 && (
            <div className="text-sm text-slate-400">
              Try asking: “How do I apply for leave?” or “How to pay fees?”
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[75%] p-4 rounded-xl text-sm shadow ${
                m.role === "user"
                  ? "ml-auto bg-slate-900 text-white"
                  : "bg-white border"
              }`}
            >
              {m.role === "ai" ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium">
                    Based on institutional records:
                  </div>

                  {m.data.policies.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-500">Relevant Policies</div>
                      <ul className="list-disc ml-5 text-sm">
                        {m.data.policies.map((p) => (
                          <li key={p.id}>
                            <a
                              href={`/student/policies/${p.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {p.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.data.procedures.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-500">Relevant Procedures</div>
                      <ul className="list-disc ml-5 text-sm">
                        {m.data.procedures.map((p) => (
                          <li key={p.id}>
                            <a
                              href={`/student/procedures/${p.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {p.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                m.text
              )}
            </div>
          ))}

          {loading && (
            <div className="text-sm text-slate-500">
              AI is thinking…
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-3 bg-white">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question here..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && askAI()}
          />
          <button
            onClick={askAI}
            className="bg-indigo-600 text-white px-5 rounded-lg text-sm"
          >
            Ask
          </button>
        </div>
      </div>

      {/* Intelligence Panel */}
      <div className="border rounded-2xl shadow-sm bg-white p-6 space-y-6">
        <h2 className="text-sm font-semibold text-slate-600">
          AI Insights
        </h2>

        {messages.length > 0 &&
          messages[messages.length - 1].role === "ai" ? (
            (() => {
              const last = messages[messages.length - 1] as {
                role: "ai";
                data: AIResponse;
              };

              return (
                <>
                  <div>
                    <div className="text-xs text-slate-500">Detected Intent</div>
                    <div className="font-semibold text-lg">
                      {last.data.intent}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">Confidence Level</div>
                    <div className="font-semibold text-lg">
                      {last.data.confidence}%
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">
                    This interaction contributes to campus policy clarity analytics.
                  </div>
                </>
              );
            })()
          ) : (
            <div className="text-xs text-slate-400">
              Ask a question to see AI analysis here.
            </div>
          )}

      </div>
    </div>
  );
}
