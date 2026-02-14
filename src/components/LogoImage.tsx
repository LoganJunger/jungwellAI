"use client";

import { useState } from "react";
import { getGenericStartupLogoDataUrl, getPrimaryLogoUrl } from "@/lib/logo";

export function LogoImage({ domain, companyName, className = "logo" }: { domain: string; companyName: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={failed ? getGenericStartupLogoDataUrl(companyName) : getPrimaryLogoUrl(domain)}
      alt={`${companyName} logo`}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
