"use client";

import { useState } from "react";

export default function RatePage() {
  const [score, setScore] = useState(4);
  const [domain, setDomain] = useState("hubspot.com");
  const [text, setText] = useState("");
  const [result, setResult] = useState<string>("");

  async function submit() {
    const res = await fetch("/api/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, score, text })
    });
    const data = await res.json();
    setResult(JSON.stringify(data));
  }

  return (
    <main>
      <h1>Rate your company</h1>
      <p className="muted">How happy are you right now?</p>
      <input className="input" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="company domain" />
      <select value={score} onChange={(e) => setScore(Number(e.target.value))}>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}</select>
      <div className="panel">
        <h3>One change your manager controls that would improve this score</h3>
        <p className="muted">Do not include names, emails, phone numbers, or ticket numbers.</p>
        <textarea rows={5} maxLength={280} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={submit}>Submit rating</button>
      {result ? <pre className="panel">{result}</pre> : null}
    </main>
  );
}
