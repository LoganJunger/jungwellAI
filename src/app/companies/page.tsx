"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Result = { name: string; domain: string; logoUrl: string | null; vScore: number | null; privacyMet: boolean };

export default function CompaniesPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    fetch(`/api/companies/search?q=${encodeURIComponent(q)}`).then((r) => r.json()).then(setResults);
  }, [q]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Company Directory</h1>
      <input className="w-full rounded border p-2" placeholder="Search by company or domain" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid gap-3 md:grid-cols-2">
        {results.map((company) => (
          <Link href={`/company/${company.domain}`} key={company.domain} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {company.logoUrl ? <img src={company.logoUrl} alt={company.name} className="h-8 w-8 rounded" /> : null}
                <div>
                  <p className="font-semibold">{company.name}</p>
                  <p className="text-xs text-black/70">{company.domain}</p>
                </div>
              </div>
              {company.privacyMet && company.vScore ? <span className="rounded-full bg-black px-3 py-1 text-xs text-white">V {company.vScore}</span> : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
