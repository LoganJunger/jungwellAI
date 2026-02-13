import { NextRequest, NextResponse } from "next/server";
import { buildCompanySummary } from "@/lib/company";

export async function GET(_: NextRequest, { params }: { params: { domain: string } }) {
  const summary = await buildCompanySummary(params.domain.toLowerCase());
  if (!summary) return NextResponse.json({ error: "Company not found" }, { status: 404 });
  return NextResponse.json(summary);
}
