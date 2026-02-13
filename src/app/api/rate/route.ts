import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cleanOneThing } from "@/utils/textFilter";
import { getSessionUserFromRequest, upsertUserFromEmail } from "@/lib/auth";
import { companyNameFromDomain, buildCompanySummary } from "@/lib/company";
import { resolveLogoUrl } from "@/lib/logo";
import { db } from "@/lib/db";
import { currentUtcMonthStart } from "@/lib/time";
import { consumeRateLimit } from "@/lib/rateLimit";
import { ratingUniqueKey } from "@/utils/ratingRules";

const schema = z.object({ score: z.number().int().min(1).max(5), text: z.string().min(1).max(280) });

export async function POST(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRateLimit = await consumeRateLimit(`rate:user:${session.email}`, 3, 3600);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipRateLimit = await consumeRateLimit(`rate:ip:${ip}`, 10, 3600);
  if (!userRateLimit.allowed || !ipRateLimit.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const user = await upsertUserFromEmail(session.email);
  const ratingMonth = currentUtcMonthStart();
  const domain = session.emailDomain;
  const _uniqueKey = ratingUniqueKey(user.id, "pending", ratingMonth.toISOString());

  let company = await db.company.findUnique({ where: { domain } });
  if (!company) {
    company = await db.company.create({
      data: {
        domain,
        name: companyNameFromDomain(domain),
        logoUrl: await resolveLogoUrl(domain)
      }
    });
  }

  const cleanedText = cleanOneThing(parsed.data.text);

  try {
    await db.$transaction(async (tx) => {
      await tx.rating.create({
        data: {
          userId: user.id,
          companyId: company!.id,
          score: parsed.data.score,
          ratingMonth
        }
      });

      await tx.oneThing.create({
        data: {
          userId: user.id,
          companyId: company!.id,
          text: cleanedText,
          ratingMonth
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 500 + Math.floor(Math.random() * 1000)));

      const agg = await tx.rating.aggregate({ where: { companyId: company!.id, ratingMonth }, _avg: { score: true }, _count: { id: true } });
      await tx.companyMonth.upsert({
        where: { companyId_month: { companyId: company!.id, month: ratingMonth } },
        create: { companyId: company!.id, month: ratingMonth, avgScore: agg._avg.score ?? 0, ratings: agg._count.id },
        update: { avgScore: agg._avg.score ?? 0, ratings: agg._count.id }
      });
    });
  } catch {
    return NextResponse.json({ error: "You already submitted a rating for this month." }, { status: 409 });
  }

  const summary = await buildCompanySummary(domain);
  return NextResponse.json(summary);
}
