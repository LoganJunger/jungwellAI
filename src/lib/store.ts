import { companies, findCompany, searchCompanies } from "@/data/mockData";
import { cleanOneThing } from "@/utils/textFilter";

type Submission = { domain: string; score: number; text: string; createdAt: string };
const submissions: Submission[] = [];

export function getSummary(domain: string) {
  const company = findCompany(domain);
  if (!company) return null;
  return {
    domain: company.domain,
    name: company.name,
    logoUrl: company.logoUrl,
    vScore: company.privacyMet ? company.vScore : null,
    ratingsCount: company.ratingsCount,
    lastUpdated: company.lastUpdated,
    privacyMet: company.privacyMet
  };
}

export function getTrend(domain: string) {
  return findCompany(domain)?.trend ?? null;
}

export function search(q: string) {
  return searchCompanies(q).map((c) => ({ domain: c.domain, name: c.name, logoUrl: c.logoUrl, privacyMet: c.privacyMet, vScore: c.vScore }));
}

export function addRating(input: { domain: string; score: number; text: string }) {
  const domain = input.domain.toLowerCase().trim();
  const company = findCompany(domain);
  const score = Math.max(1, Math.min(5, Number(input.score || 0)));
  const text = cleanOneThing(String(input.text || ""));

  submissions.push({ domain, score, text, createdAt: new Date().toISOString() });

  if (!company) {
    return {
      ok: true,
      summary: {
        domain,
        name: domain.split(".")[0],
        logoUrl: `https://logo.clearbit.com/${domain}`,
        vScore: null,
        ratingsCount: 1,
        privacyMet: false,
        lastUpdated: new Date().toISOString().slice(0, 10)
      }
    };
  }

  return { ok: true, summary: getSummary(domain), oneThing: text };
}
