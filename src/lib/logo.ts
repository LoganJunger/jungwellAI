const LOGO_BASE = process.env.NEXT_PUBLIC_LOGO_API_BASE_URL || "https://img.logo.dev";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_LOGO_PUBLISHABLE_KEY || "";

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

  return url.toString();
}

/**
 * Generic fallback artwork (Web 2.0 startup aesthetic).
 * Intentionally provider-independent and does not rely on external URLs.
 */
export function getGenericStartupLogoDataUrl(companyName: string): string {
  const label = (companyName || "Startup")
    .trim()
    .slice(0, 18)
    .replace(/[<>]/g, "") || "Startup";

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='%236ad6ff'/>
      <stop offset='100%' stop-color='%234d7cff'/>
    </linearGradient>
    <linearGradient id='shine' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0%' stop-color='white' stop-opacity='0.65'/>
      <stop offset='100%' stop-color='white' stop-opacity='0'/>
    </linearGradient>
  </defs>
  <rect width='96' height='96' rx='18' fill='url(%23bg)'/>
  <ellipse cx='48' cy='22' rx='34' ry='14' fill='url(%23shine)'/>
  <path d='M31 60 L48 28 L65 60 L54 60 L54 72 L42 72 L42 60 Z' fill='white' fill-opacity='0.95'/>
  <text x='50%' y='86%' dominant-baseline='middle' text-anchor='middle' font-family='Verdana, Arial, sans-serif' font-size='10' font-weight='700' letter-spacing='0.8' fill='white'>${label.toUpperCase()}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
