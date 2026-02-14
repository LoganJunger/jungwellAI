"use client";

import { useMemo, useState } from "react";
import { getFaviconUrl, getMonogramDataUrl, getPrimaryLogoUrl } from "@/lib/logo";

export function LogoImage({ domain, companyName, className = "logo" }: { domain: string; companyName: string; className?: string }) {
  const fallbacks = useMemo(
    () => [getPrimaryLogoUrl(domain), getFaviconUrl(domain), getMonogramDataUrl(companyName)],
    [domain, companyName]
  );

  const [index, setIndex] = useState(0);

  return (
    <img
      src={fallbacks[index]}
      alt={`${companyName} logo`}
      className={className}
      onError={() => setIndex((current) => Math.min(current + 1, fallbacks.length - 1))}
    />
  );
}
