"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RatePage() {
  const router = useRouter();
  const [score, setScore] = useState(4);
  const [text, setText] = useState("");
  const [email, setEmail] = useState("");

  async function submit() {
    if (!email) return alert("Enter your work email first.");
    const response = await fetch("/api/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-email": email },
      body: JSON.stringify({ score, text })
    });
    const data = await response.json();
    if (!response.ok) return alert(data.error ?? "Failed");
    router.push(`/company/${data.domain}`);
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Rate your company</h1>
      <p className="text-sm">Do not include names, emails, phone numbers, or ticket numbers.</p>
      <input className="w-full rounded border p-2" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label className="block">How happy are you right now: {score}</label>
      <input type="range" min={1} max={5} value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full" />
      <textarea className="w-full rounded border p-2" maxLength={280} placeholder="One change your manager controls..." value={text} onChange={(e) => setText(e.target.value)} />
      <button className="btn-primary" onClick={submit}>Submit rating</button>
      <p className="text-xs text-black/60">If logged out, use <a className="underline" href="/login">/login</a>.</p>
    </div>
  );
}
