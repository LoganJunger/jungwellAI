"use client";

import { useEffect, useState } from "react";

type Session = { user: null | { email: string; handle: string } };
type History = { ratings: Array<{ id: string; score: number; ratingMonth: string; company: { name: string; domain: string } }> };

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<Session>({ user: null });
  const [history, setHistory] = useState<History>({ ratings: [] });

  useEffect(() => {
    if (!email) return;
    fetch("/api/auth/session", { headers: { "x-user-email": email } }).then((r) => r.json()).then(setSession);
    fetch("/api/account/history", { headers: { "x-user-email": email } }).then((r) => r.json()).then(setHistory);
  }, [email]);

  const exportData = () => window.open("/api/account/export", "_blank");
  const deleteData = async () => {
    await fetch("/api/account/delete", { method: "POST", headers: { "x-user-email": email } });
    alert("Account deleted.");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My account</h1>
      <input className="w-full max-w-md rounded border p-2" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <p>Handle: {session.user?.handle ?? "Sign in first"}</p>
      <div className="flex gap-3">
        <button className="btn-primary" onClick={exportData}>Export my data</button>
        <button className="rounded-xl border px-4 py-2" onClick={deleteData}>Delete my account</button>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 text-lg font-semibold">Last 12 ratings</h2>
        <ul className="space-y-1 text-sm">
          {history.ratings.map((r) => (<li key={r.id}>{r.company.name} ({r.company.domain}) — {r.score}/5</li>))}
        </ul>
      </div>
    </div>
  );
}
