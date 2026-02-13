export type CompanySummary = {
  domain: string;
  name: string;
  logoUrl: string | null;
  vScore: number | null;
  ratingsCount: number;
  lastUpdated: string | null;
  privacyMet: boolean;
};
