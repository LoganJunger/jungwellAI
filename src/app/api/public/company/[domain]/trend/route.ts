import { NextRequest, NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabaseAdmin";
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

  const { data: company, error: companyError } = await supaAdmin
    .from("Company")
    .select("id")
    .eq("domain", params.domain.toLowerCase())
    .single();

  if (companyError || !company) return withCors(NextResponse.json([]));

  const { data: trend, error: trendError } = await supaAdmin
    .from("CompanyMonth")
    .select("month, avgScore, ratings")
    .eq("companyId", company.id)
    .order("month", { ascending: false })
    .limit(12);

  if (trendError) return withCors(NextResponse.json([], { status: 500 }));

  return withCors(
    NextResponse.json(
      (trend || []).reverse().map((m) => ({
        month: formatMonth(new Date(m.month)),
        avgScore: m.avgScore,
        ratings: m.ratings
      }))
    )
  );
}
