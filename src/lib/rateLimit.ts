import { supaAdmin } from "@/lib/supabaseAdmin";

export async function consumeRateLimit(key: string, limit: number, windowSeconds: number) {
  const now = new Date();

  // Try to get existing rate limit entry
  const { data: existing } = await supaAdmin
    .from("rate_limits")
    .select("count, expires_at")
    .eq("key", key)
    .single();

  if (!existing) {
    // No entry — create one
    const expiresAt = new Date(now.getTime() + windowSeconds * 1000).toISOString();
    await supaAdmin.from("rate_limits").insert({ key, count: 1, expires_at: expiresAt });
    return { allowed: true, remaining: limit - 1, resetAt: new Date(expiresAt) };
  }

  const expired = new Date(existing.expires_at) < now;

  if (expired) {
    // Reset the window
    const expiresAt = new Date(now.getTime() + windowSeconds * 1000).toISOString();
    await supaAdmin.from("rate_limits").update({ count: 1, expires_at: expiresAt }).eq("key", key);
    return { allowed: true, remaining: limit - 1, resetAt: new Date(expiresAt) };
  }

  // Increment
  const newCount = existing.count + 1;
  await supaAdmin.from("rate_limits").update({ count: newCount }).eq("key", key);

  return {
    allowed: newCount <= limit,
    remaining: Math.max(0, limit - newCount),
    resetAt: new Date(existing.expires_at),
  };
}
