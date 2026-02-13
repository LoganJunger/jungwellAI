export async function resolveLogoUrl(domain: string) {
  const clearbit = `https://logo.clearbit.com/${domain}`;
  try {
    const response = await fetch(clearbit, { method: "HEAD" });
    if (response.ok) return clearbit;
  } catch {
    // ignore and fallback
  }

  const favicon = `https://${domain}/favicon.ico`;
  try {
    const response = await fetch(favicon, { method: "HEAD" });
    if (response.ok) return favicon;
  } catch {
    // ignore and fallback
  }

  return null;
}
