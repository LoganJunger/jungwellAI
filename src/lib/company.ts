import { db } from "@/lib/db";
import { privacyFloor } from "@/lib/config";

export async function buildCompanySummary(domain: string) {
  const company = await db.company.findUnique({
    where: { domain },
    include: {
      months: { orderBy: { month: "desc" }, take: 1 },
      _count: { select: { ratings: true } }
    }
  });
  if (!company) return null;

  const month = company.months[0] ?? null;
  const ratingsCount = month?.ratings ?? 0;
  const privacyMet = ratingsCount >= privacyFloor;
  const estimatedVScore = ratingsCount === 0 ? 3.5 : null;

  return {
    domain: company.domain,
    name: company.name,
    logoUrl: company.logoUrl,
    vScore: privacyMet ? Number(month?.avgScore?.toFixed(1) ?? 0) : null,
    ratingsCount,
    lastUpdated: month?.updatedAt?.toISOString() ?? null,
    privacyMet,
    estimatedVScore,
    confidence: estimatedVScore ? 0.35 : null
  };
}

export function companyNameFromDomain(domain: string) {
  return domain
    .split(".")[0]
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
