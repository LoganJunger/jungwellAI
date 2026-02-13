"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Result = { name: string; domain: string; logoUrl: string | null; vScore: number | null; privacyMet: boolean };

export default function CompaniesPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/companies/search?q=${encodeURIComponent(debouncedQ)}`)
      .then((r) => r.json())
      .then((data) => { setResults(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [debouncedQ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Company Directory</h1>
        <p className="mt-2 text-gray-500">Explore CS team ratings across {results.length > 0 ? "thousands of" : ""} companies</p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-base shadow-sm transition-all focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
          placeholder="Search by company name or domain..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-orange-500" />
        </div>
      ) : results.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-lg font-medium text-gray-400">No companies found</p>
          <p className="mt-2 text-sm text-gray-400">Try a different search term</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((company) => (
            <Link href={`/company/${company.domain}`} key={company.domain} className="card card-hover flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="h-10 w-10 rounded object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <span className="text-lg font-bold text-gray-300">{company.name.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{company.name}</p>
                <p className="truncate text-xs text-gray-400">{company.domain}</p>
              </div>
              {company.privacyMet && company.vScore ? (
                <span className="score-badge flex-shrink-0">{company.vScore.toFixed(1)}</span>
              ) : (
                <span className="flex-shrink-0 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">—</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
