"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const scoreLabels = ["", "Unhappy", "Dissatisfied", "Neutral", "Happy", "Thriving"];
const scoreEmojis = ["", "😞", "😕", "😐", "😊", "🤩"];

export default function RatePage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!email) { setError("Please enter your work email."); return; }
    if (score === 0) { setError("Please select a score."); return; }
    if (!text.trim()) { setError("Please share one thing your manager could improve."); return; }

    setSubmitting(true); setError("");
    const response = await fetch("/api/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-email": email },
      body: JSON.stringify({ score, text })
    });
    const data = await response.json();
    setSubmitting(false);
    if (!response.ok) { setError(data.error ?? "Something went wrong."); return; }
    router.push(`/company/${data.domain}`);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Rate your CS team</h1>
        <p className="mt-3 text-gray-500">Anonymous. Takes 30 seconds. Helps the whole community.</p>
      </div>

      <div className="mt-10 space-y-6">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Work email</label>
          <input
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
            placeholder="you@company.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <p className="mt-1 text-xs text-gray-400">Used to match you to your company. Never displayed.</p>
        </div>

        {/* Score */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">How happy are you as a CSM right now?</label>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setScore(n)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 p-3 transition-all ${score === n ? "border-orange-400 bg-orange-50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"}`}
              >
                <span className="text-2xl">{scoreEmojis[n]}</span>
                <span className="text-xs font-medium text-gray-500">{n}</span>
              </button>
            ))}
          </div>
          {score > 0 && <p className="mt-2 text-center text-sm font-medium brand-gradient">{scoreLabels[score]}</p>}
        </div>

        {/* One thing */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">One thing your manager could change</label>
          <textarea
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
            rows={3} maxLength={280} placeholder="e.g., Better tooling for QBRs, more transparent comp structure..."
            value={text} onChange={(e) => setText(e.target.value)}
          />
          <p className="mt-1 text-right text-xs text-gray-400">{text.length}/280</p>
        </div>

        {/* Error */}
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

        {/* Submit */}
        <button className="btn-primary w-full py-4 text-base" onClick={submit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit anonymous rating"}
        </button>

        <p className="text-center text-xs text-gray-400">
          Do not include names, emails, or phone numbers in your feedback. See our <Link href="/privacy" className="underline hover:text-gray-600">privacy policy</Link>.
        </p>
      </div>
    </div>
  );
}
