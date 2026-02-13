import { NextRequest, NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabaseAdmin";
import { withCors } from "@/lib/cors";
import { consumeRateLimit } from "@/lib/rateLimit";

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowed = await consumeRateLimit(`public:companies:${ip}`, 60, 3600);
  if (!allowed.allowed) return withCors(NextResponse.json({ error: "Too many requests" }, { status: 429 }));

  const { data: items, error } = await supaAdmin
    .from("Company")
    .select("name, domain, logoUrl")
    .order("name", { ascending: true })
    .limit(100);

  if (error) return withCors(NextResponse.json([], { status: 500 }));

  return withCors(NextResponse.json(items));
}
