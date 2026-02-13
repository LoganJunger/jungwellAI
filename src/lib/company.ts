import { supaAdmin } from "@/lib/supabaseAdmin";
import { privacyFloor } from "@/lib/config";

export async function buildCompanySummary(domain: string) {
  // Fetch company via Supabase REST API (works over HTTPS from serverless)
  const { data: company, error } = await supaAdmin
    .from("Company")
    .select("id, domain, name, logoUrl")
    .eq("domain", domain)
    .single();

  if (error || !company) return null;

  // Fetch latest CompanyMonth
  const { data: months } = await supaAdmin
    .from("CompanyMonth")
    .select("avgScore, ratings, updatedAt")
    .eq("companyId", company.id)
    .order("month", { ascending: false })
    .limit(1);

  const month = months?.[0] ?? null;
  const ratingsCount = month?.ratings ?? 0;
  const privacyMet = ratingsCount >= privacyFloor;
  const estimatedVScore = ratingsCount === 0 ? 3.5 : null;

  return {
    domain: company.domain,
    name: company.name,
    logoUrl: company.logoUrl,
    vScore: privacyMet ? Number(Number(month?.avgScore ?? 0).toFixed(1)) : null,
    ratingsCount,
    lastUpdated: month?.updatedAt ?? null,
    privacyMet,
    estimatedVScore,
    confidence: estimatedVScore ? 0.35 : null,
  };
}

export function companyNameFromDomain(domain: string) {
  return domain
    .split(".")[0]
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
