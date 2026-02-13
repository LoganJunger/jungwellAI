import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formatMonth } from "@/lib/time";
import { withCors } from "@/lib/cors";
import { consumeRateLimit } from "@/lib/rateLimit";

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest, { params }: { params: { domain: string } }) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await consumeRateLimit(`public:trend:${ip}`, 120, 3600);
  if (!allowed.allowed) return withCors(NextResponse.json({ error: "Too many requests" }, { status: 429 }));

  const company = await db.company.findUnique({ where: { domain: params.domain.toLowerCase() }, select: { id: true } });
  if (!company) return withCors(NextResponse.json([]));
  const trend = await db.companyMonth.findMany({ where: { companyId: company.id }, orderBy: { month: "desc" }, take: 12 });
  return withCors(NextResponse.json(trend.reverse().map((m) => ({ month: formatMonth(m.month), avgScore: m.avgScore, ratings: m.ratings }))));
}
