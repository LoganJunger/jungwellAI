const HUBSPOT_LOGO_BASE = process.env.NEXT_PUBLIC_HUBSPOT_LOGO_BASE_URL || "https://logo.hubspot.com";

/**
 * Clearbit free logo URLs are deprecated/sunset.
 * Build the HubSpot logo URL (or custom compatible base via env override).
 */
export function getPrimaryLogoUrl(domain: string): string {
  const safeDomain = domain.trim().toLowerCase();
  return `${HUBSPOT_LOGO_BASE}/${safeDomain}`;
}

export function getFaviconUrl(domain: string): string {
  return `https://${domain.trim().toLowerCase()}/favicon.ico`;
}

export function getMonogramDataUrl(companyName: string): string {
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "VN";

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23FF5C5C'/><stop offset='100%' stop-color='%23F28C13'/></linearGradient></defs><rect width='96' height='96' rx='18' fill='url(%23g)'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='34' font-weight='700' fill='white'>${initials}</text></svg>`;

  return `data:image/svg+xml;utf8,${svg}`;
}
