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
  "2025-03", "2025-04", "2025-05", "2025-06", "2025-07", "2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02"
];

function trend(base: number): TrendPoint[] {
  return monthSeries.map((month, i) => ({
    month,
    avgScore: Math.max(1, Math.min(5, Number((base + Math.sin(i / 2) * 0.25).toFixed(1)))),
    ratings: 6 + (i % 7)
  }));
}

export const companies: CompanySummary[] = [
  {
    name: "Salesforce",
    domain: "salesforce.com",
    logoUrl: getPrimaryLogoUrl("salesforce.com"),
    ratingsCount: 88,
    lastUpdated: "2026-02-12",
    vScore: 4.3,
    privacyMet: true,
    oneThings: ["Protect customer-facing time with a no-meeting half day.", "Keep playbooks tighter when ownership changes."],
    trend: trend(4.2)
  },
  {
    name: "HubSpot",
    domain: "hubspot.com",
    logoUrl: getPrimaryLogoUrl("hubspot.com"),
    ratingsCount: 64,
    lastUpdated: "2026-02-12",
    vScore: 4.1,
    privacyMet: true,
    oneThings: ["Reduce exception process overhead for renewals.", "Increase AI tooling coverage for prep work."],
    trend: trend(4)
  },
  {
    name: "Zendesk",
    domain: "zendesk.com",
    logoUrl: getPrimaryLogoUrl("zendesk.com"),
    ratingsCount: 41,
    lastUpdated: "2026-02-11",
    vScore: 3.8,
    privacyMet: true,
    oneThings: ["Make escalation thresholds consistent across regions.", "Reserve Fridays for strategic customer work."],
    trend: trend(3.7)
  },
  {
    name: "Gainsight",
    domain: "gainsight.com",
    logoUrl: getPrimaryLogoUrl("gainsight.com"),
    ratingsCount: 18,
    lastUpdated: "2026-02-09",
    vScore: 3.9,
    privacyMet: true,
    oneThings: ["Tighten handoff quality from implementation to CSM."],
    trend: trend(3.85)
  },
  {
    name: "Intercom",
    domain: "intercom.com",
    logoUrl: getPrimaryLogoUrl("intercom.com"),
    ratingsCount: 12,
    lastUpdated: "2026-02-08",
    vScore: 3.6,
    privacyMet: true,
    oneThings: ["Reduce context switching across support channels."],
    trend: trend(3.5)
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
