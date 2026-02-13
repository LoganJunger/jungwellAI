import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUtcMonthStart } from "@/lib/time";
import { privacyFloor } from "@/lib/config";

export async function GET(_: Request, { params }: { params: { domain: string } }) {
  const company = await db.company.findUnique({ where: { domain: params.domain.toLowerCase() } });
  if (!company) return NextResponse.json({ items: [] });

  const month = await db.companyMonth.findUnique({ where: { companyId_month: { companyId: company.id, month: currentUtcMonthStart() } } });
  if (!month || month.ratings < privacyFloor) return NextResponse.json({ items: [] });

  const items = await db.oneThing.findMany({
    where: { companyId: company.id, ratingMonth: currentUtcMonthStart() },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, text: true, createdAt: true }
  });

  return NextResponse.json({ items });
}
