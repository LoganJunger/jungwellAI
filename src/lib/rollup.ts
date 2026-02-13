import { db } from "@/lib/db";
import { currentUtcMonthStart } from "@/lib/time";

export async function recomputeMonth(month: Date) {
  const companies = await db.company.findMany({ select: { id: true } });
  for (const company of companies) {
    const grouped = await db.rating.aggregate({
      where: { companyId: company.id, ratingMonth: month },
      _avg: { score: true },
      _count: { id: true }
    });

    if (!grouped._count.id) continue;

    await db.companyMonth.upsert({
      where: { companyId_month: { companyId: company.id, month } },
      create: {
        companyId: company.id,
        month,
        avgScore: grouped._avg.score ?? 0,
        ratings: grouped._count.id
      },
      update: {
        avgScore: grouped._avg.score ?? 0,
        ratings: grouped._count.id
      }
    });
  }
}

export async function backfillLast12MonthsIfEmpty() {
  const existing = await db.companyMonth.count();
  if (existing > 0) return;

  const current = currentUtcMonthStart();
  for (let i = 0; i < 12; i += 1) {
    const month = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - i, 1));
    await recomputeMonth(month);
  }
}
