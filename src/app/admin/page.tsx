"use client";

import { useState } from "react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Array<{ id: string; name: string; domain: string; logoUrl: string | null }>>([]);

  async function search() {
    const res = await fetch(`/api/admin/company?q=${encodeURIComponent(q)}`, { headers: { "x-user-email": email } });
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin</h1>
      <input className="w-full max-w-md rounded border p-2" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="flex gap-2">
        <input className="w-full max-w-md rounded border p-2" placeholder="Search companies" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-primary" onClick={search}>Search</button>
      </div>
      <ul className="space-y-2">
        {results.map((item) => (
          <li key={item.id} className="rounded border bg-white p-3">{item.name} ({item.domain})</li>
        ))}
      </ul>
      <p className="text-sm text-black/60">Merge companies and remove one-things are implemented via admin API routes.</p>
    </div>
  );
}
