import { NextRequest, NextResponse } from "next/server";
import { buildCompanySummary } from "@/lib/company";
import { withCors } from "@/lib/cors";
import { consumeRateLimit } from "@/lib/rateLimit";

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest, { params }: { params: { domain: string } }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await consumeRateLimit(`public:summary:${ip}`, 120, 3600);
  if (!allowed.allowed) return withCors(NextResponse.json({ error: "Too many requests" }, { status: 429 }));
  const summary = await buildCompanySummary(params.domain.toLowerCase());
  if (!summary) return withCors(NextResponse.json({ error: "Not found" }, { status: 404 }));
  return withCors(NextResponse.json(summary));
}
