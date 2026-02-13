import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { formatMonth } from "@/lib/time";

export async function GET(_: Request, { params }: { params: { domain: string } }) {
  const company = await db.company.findUnique({ where: { domain: params.domain.toLowerCase() }, select: { id: true } });
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const months = await db.companyMonth.findMany({
    where: { companyId: company.id },
    orderBy: { month: "desc" },
    take: 12
  });

  return NextResponse.json(
    months
      .reverse()
      .map((m) => ({ month: formatMonth(m.month), avgScore: Number(m.avgScore.toFixed(2)), ratings: m.ratings }))
  );
}
