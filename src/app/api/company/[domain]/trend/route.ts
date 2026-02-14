import { NextResponse } from "next/server";
import { getTrend } from "@/lib/store";

export async function GET(_request: Request, { params }: { params: { domain: string } }) {
  const trend = getTrend(params.domain);
  if (!trend) return NextResponse.json({ error: "Company not found" }, { status: 404 });
  return NextResponse.json(trend);
}
