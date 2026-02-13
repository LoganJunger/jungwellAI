import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { buildCompanySummary } from "@/lib/company";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  const companies = await db.company.findMany({
    where: q
      ? {
          OR: [{ name: { contains: q, mode: "insensitive" } }, { domain: { contains: q, mode: "insensitive" } }]
        }
      : undefined,
    orderBy: [{ name: "asc" }],
    take: 20
  });

  const results = await Promise.all(
    companies.map(async (company) => {
      const summary = await buildCompanySummary(company.domain);
      return { name: company.name, domain: company.domain, logoUrl: company.logoUrl, vScore: summary?.vScore, privacyMet: summary?.privacyMet ?? false };
    })
  );

  return NextResponse.json(results);
}
