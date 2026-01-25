"use client";

import { useState } from "react";

export default function StudentFeedbackPage() {
  const [message, setMessage] = useState("");
  const [domain, setDomain] = useState("GENERAL");
  const [sentiment, setSentiment] = useState("NEUTRAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    await fetch("/api/student/feedback", {
      method: "POST",
      body: JSON.stringify({
        message,
        domain,
        sentiment,
        priority,
      }),
    });

    setSubmitted(true);
    setMessage("");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-700 text-white p-6 rounded-xl">
        <h1 className="text-2xl font-semibold">Student Feedback</h1>
        <p className="text-sm opacity-80">
          Help us improve campus services and policies
        </p>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5">
        {submitted && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded">
            Feedback submitted successfully. Thank you.
          </div>
        )}

        {/* Domain */}
        <div>
          <label className="text-sm font-medium">Concern Area</label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="mt-1 w-full border rounded-md p-2"
          >
            <option>ACADEMICS</option>
            <option>EXAMS</option>
            <option>FEES</option>
            <option>HOSTEL</option>
            <option>GENERAL</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="text-sm font-medium">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-1 w-full border rounded-md p-2"
            placeholder="Describe your concern, issue, or suggestion..."
          />
        </div>

        {/* Sentiment */}
        <div>
          <label className="text-sm font-medium">How do you feel?</label>
          <div className="flex gap-4 mt-2">
            {["POSITIVE", "NEUTRAL", "NEGATIVE"].map((s) => (
              <button
                key={s}
                onClick={() => setSentiment(s)}
                className={`px-3 py-1 rounded border text-sm ${
                  sentiment === s ? "bg-slate-900 text-white" : ""
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm font-medium">Priority</label>
          <div className="flex gap-4 mt-2">
            {["LOW", "MEDIUM", "HIGH"].map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-3 py-1 rounded border text-sm ${
                  priority === p ? "bg-slate-900 text-white" : ""
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-slate-900 text-white px-6 py-2 rounded-md"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
