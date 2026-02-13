import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { withCors } from "@/lib/cors";
import { consumeRateLimit } from "@/lib/rateLimit";

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await consumeRateLimit(`public:companies:${ip}`, 60, 3600);
  if (!allowed.allowed) return withCors(NextResponse.json({ error: "Too many requests" }, { status: 429 }));

  const items = await db.company.findMany({ select: { name: true, domain: true, logoUrl: true }, orderBy: { name: "asc" }, take: 100 });
  return withCors(NextResponse.json(items));
}
