const LOGO_BASE = process.env.NEXT_PUBLIC_LOGO_API_BASE_URL || "https://img.logo.dev";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_LOGO_PUBLISHABLE_KEY || "";

function initialsFromName(companyName: string): string {
  const parts = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "");

  return (parts.join("") || "VN").slice(0, 2);
}

/**
 * Clearbit migration target:
 * https://img.logo.dev/{domain}?token=pk_...
 */
export function getPrimaryLogoUrl(domain: string): string {
  const safeDomain = domain.trim().toLowerCase();
  const url = new URL(`${LOGO_BASE.replace(/\/$/, "")}/${safeDomain}`);

  if (PUBLISHABLE_KEY) {
    url.searchParams.set("token", PUBLISHABLE_KEY);
  }

  url.searchParams.set("size", "160");
  url.searchParams.set("format", "png");

  return url.toString();
}

/**
 * Generic fallback artwork aligned to Var Nöjd branding.
 */
export function getGenericStartupLogoDataUrl(companyName: string): string {
  const initials = initialsFromName(companyName);

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='%23FF5C5C'/>
      <stop offset='100%' stop-color='%23F28C13'/>
    </linearGradient>
  </defs>
  <rect x='2' y='2' width='92' height='92' rx='24' fill='url(%23bg)'/>
  <rect x='9' y='9' width='78' height='78' rx='18' fill='none' stroke='white' stroke-opacity='0.3' />
  <circle cx='48' cy='36' r='14' fill='white' fill-opacity='0.2'/>
  <text x='50%' y='58%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Montserrat, Arial, sans-serif' font-size='26' font-weight='800' letter-spacing='1' fill='white'>${initials}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
