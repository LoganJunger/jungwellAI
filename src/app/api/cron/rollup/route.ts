import { NextRequest, NextResponse } from "next/server";
import { backfillLast12MonthsIfEmpty, recomputeMonth } from "@/lib/rollup";
import { currentUtcMonthStart } from "@/lib/time";

function authorized(request: NextRequest) {
  return request.headers.get("x-cron-secret") === process.env.CRON_SECRET;
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await backfillLast12MonthsIfEmpty();
  await recomputeMonth(currentUtcMonthStart());
  return NextResponse.json({ ok: true });
}
