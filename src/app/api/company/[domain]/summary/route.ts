import { NextRequest, NextResponse } from "next/server";
import { getSummary } from "@/lib/store";

export async function GET(_request: NextRequest, { params }: { params: { domain: string } }) {
  const summary = getSummary(params.domain);
  if (!summary) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }
  return NextResponse.json(summary);
}
