import { getPrimaryLogoUrl } from "@/lib/logo";
export type TrendPoint = { month: string; avgScore: number; ratings: number };
export type CompanySummary = {
  name: string;
  domain: string;
  logoUrl: string;
  ratingsCount: number;
  lastUpdated: string;
  vScore: number | null;
  privacyMet: boolean;
  oneThings: string[];
  trend: TrendPoint[];
};

const monthSeries = [
  "2025-03","2025-04","2025-05","2025-06","2025-07","2025-08","2025-09","2025-10","2025-11","2025-12","2026-01","2026-02"
];

function trend(base: number): TrendPoint[] {
  return monthSeries.map((month, i) => ({
    month,
    avgScore: Math.max(1, Math.min(5, Number((base + Math.sin(i / 2) * 0.3).toFixed(1)))),
    ratings: 3 + (i % 5)
  }));
}

export const companies: CompanySummary[] = [
  {
    name: "HubSpot",
    domain: "hubspot.com",
    logoUrl: getPrimaryLogoUrl("hubspot.com"),
    ratingsCount: 41,
    lastUpdated: "2026-02-10",
    vScore: 4.2,
    privacyMet: true,
    oneThings: ["Protect focus blocks from internal meetings.", "Reduce emergency queue load by improving triage.", "Share career path criteria across regions."],
    trend: trend(4.1)
  },
  {
    name: "Zendesk",
    domain: "zendesk.com",
    logoUrl: getPrimaryLogoUrl("zendesk.com"),
    ratingsCount: 27,
    lastUpdated: "2026-02-08",
    vScore: 3.7,
    privacyMet: true,
    oneThings: ["Improve account handoff quality from sales.", "Limit after-hours escalations to true P1s."],
    trend: trend(3.6)
  },
  {
    name: "Acme Cloud",
    domain: "acmecloud.io",
    logoUrl: getPrimaryLogoUrl("acmecloud.io"),
    ratingsCount: 2,
    lastUpdated: "2026-02-06",
    vScore: null,
    privacyMet: false,
    oneThings: [],
    trend: trend(3.2)
  }
];

export function findCompany(slugOrDomain: string) {
  return companies.find((c) => c.domain === slugOrDomain || c.domain.replace(/\./g, "-") === slugOrDomain);
}

export function searchCompanies(q: string) {
  const query = q.toLowerCase().trim();
  if (!query) return companies.slice(0, 20);
  return companies
    .filter((c) => c.name.toLowerCase().includes(query) || c.domain.includes(query))
    .slice(0, 20);
}
