"use client";

import { useMemo, useState } from "react";
import { CompanyCard } from "@/components/CompanyCard";
import { companies } from "@/data/mockData";

export default function CompaniesPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => companies.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) || c.domain.includes(q.toLowerCase())), [q]);

  return (
    <main>
      <h1>Company Directory</h1>
      <p className="muted">Search by company name or domain.</p>
      <input className="input" placeholder="Search companies..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="grid">{filtered.map((company) => <CompanyCard key={company.domain} company={company} />)}</div>
    </main>
  );
}
