import { db } from "@/lib/db";

async function ensureRateLimitTable() {
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      key TEXT PRIMARY KEY,
      count INTEGER NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `);
}

export async function consumeRateLimit(key: string, limit: number, windowSeconds: number) {
  await ensureRateLimitTable();
  const now = new Date();

  await db.$executeRawUnsafe(
    `INSERT INTO rate_limits (key, count, expires_at)
     VALUES ($1, 1, NOW() + ($2 || ' seconds')::interval)
     ON CONFLICT (key)
     DO UPDATE SET
      count = CASE WHEN rate_limits.expires_at < NOW() THEN 1 ELSE rate_limits.count + 1 END,
      expires_at = CASE WHEN rate_limits.expires_at < NOW() THEN NOW() + ($2 || ' seconds')::interval ELSE rate_limits.expires_at END`,
    key,
    String(windowSeconds)
  );

  const rows = await db.$queryRawUnsafe<Array<{ count: number; expires_at: Date }>>(
    "SELECT count, expires_at FROM rate_limits WHERE key = $1",
    key
  );

  const row = rows[0];
  return {
    allowed: row.count <= limit,
    remaining: Math.max(0, limit - row.count),
    resetAt: row.expires_at
  };
}
