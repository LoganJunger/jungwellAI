"use client";

import { useState } from "react";

const blocked = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com", "icloud.com"];

function workEmail(email: string) {
  const domain = email.toLowerCase().split("@")[1] ?? "";
  return Boolean(domain) && !blocked.includes(domain);
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <button className="btn-primary" onClick={() => setMessage("Google OAuth wiring goes here via Supabase.")}>Continue with Google Workspace</button>
      <div className="rounded-xl border bg-white p-4">
        <p className="mb-2">Or send a magic link to your work email.</p>
        <input className="w-full rounded border p-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
        <button
          className="mt-3 rounded-xl border px-4 py-2"
          onClick={() => setMessage(workEmail(email) ? "Magic link would be sent via Supabase." : "Use a non-personal work email.")}
        >
          Send magic link
        </button>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
