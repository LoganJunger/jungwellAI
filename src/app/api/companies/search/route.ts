import { NextRequest, NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabaseAdmin";
import { buildCompanySummary } from "@/lib/company";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();

  let query = supaAdmin
    .from("Company")
    .select("name, domain, logoUrl")
    .order("name", { ascending: true })
    .limit(20);

  if (q) {
    // PostgREST ilike for case-insensitive search on name or domain
    query = query.or(`name.ilike.%${q}%,domain.ilike.%${q}%`);
  }

  const { data: companies, error } = await query;

  if (error || !companies) {
    return NextResponse.json([]);
  }

  const results = await Promise.all(
    companies.map(async (company: { name: string; domain: string; logoUrl: string | null }) => {
      const summary = await buildCompanySummary(company.domain);
      return {
        name: company.name,
        domain: company.domain,
        logoUrl: company.logoUrl,
        vScore: summary?.vScore,
        privacyMet: summary?.privacyMet ?? false,
      };
    })
  );

  return NextResponse.json(results);
}
