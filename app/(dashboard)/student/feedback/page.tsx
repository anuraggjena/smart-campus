"use client";

import { useState } from "react";

export default function StudentFeedbackPage() {
  const [message, setMessage] = useState("");
  const [domain, setDomain] = useState("GENERAL");
  const [sentiment, setSentiment] = useState("NEUTRAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!message.trim()) return;

    setLoading(true);

    await fetch("/api/student/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        domain,
        sentiment,
        priority,
      }),
    });

    setLoading(false);
    setSubmitted(true);
    setMessage("");
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-slate-800 text-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-semibold">Share Your Feedback</h1>
        <p className="text-sm opacity-80 mt-1">
          Your voice helps improve campus policies and services
        </p>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="p-4 rounded-xl border border-green-300 bg-green-50 text-green-800">
          Thank you. Your feedback has been submitted successfully.
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-8">

        {/* Concern Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Concern Area</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm"
          >
            <option value="ACADEMICS">Academics</option>
            <option value="EXAMS">Exams</option>
            <option value="FEES">Fees</option>
            <option value="HOSTEL">Hostel</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full border rounded-lg p-3 text-sm resize-none"
            placeholder="Describe your concern, issue, or suggestion clearly..."
          />
          <div className="text-xs text-slate-500 text-right">
            {message.length} characters
          </div>
        </div>

        {/* Sentiment */}
        <div className="space-y-2">
          <label className="text-sm font-medium">How do you feel?</label>
          <div className="flex gap-4">
            {[
              { key: "POSITIVE", label: "😊 Positive" },
              { key: "NEUTRAL", label: "😐 Neutral" },
              { key: "NEGATIVE", label: "😟 Negative" },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setSentiment(s.key)}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  sentiment === s.key
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <div className="flex gap-4">
            {["LOW", "MEDIUM", "HIGH"].map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-lg border text-sm ${
                  priority === p
                    ? "bg-slate-900 text-white"
                    : "bg-white"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg text-sm"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
