import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cleanOneThing } from "@/utils/textFilter";
import { getSessionUserFromRequest, upsertUserFromEmail } from "@/lib/auth";
import { companyNameFromDomain, buildCompanySummary } from "@/lib/company";
import { resolveLogoUrl } from "@/lib/logo";
import { supaAdmin } from "@/lib/supabaseAdmin";
import { currentUtcMonthStart } from "@/lib/time";
import { consumeRateLimit } from "@/lib/rateLimit";

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

  // Find or create company
  let { data: company } = await supaAdmin
    .from("Company")
    .select("id, domain")
    .eq("domain", domain)
    .single();

  if (!company) {
    const logoUrl = await resolveLogoUrl(domain);
    const { data: newCompany, error } = await supaAdmin
      .from("Company")
      .insert({
        domain,
        name: companyNameFromDomain(domain),
        logoUrl,
      })
      .select("id, domain")
      .single();

    if (error || !newCompany) {
      return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
    }
    company = newCompany;
  }

  const cleanedText = cleanOneThing(parsed.data.text);

  try {
    // Insert rating
    const { error: ratingError } = await supaAdmin.from("Rating").insert({
      userId: user.id,
      companyId: company.id,
      score: parsed.data.score,
      ratingMonth: ratingMonth.toISOString(),
    });

    if (ratingError) {
      return NextResponse.json({ error: "You already submitted a rating for this month." }, { status: 409 });
    }

    // Insert one-thing
    await supaAdmin.from("OneThing").insert({
      userId: user.id,
      companyId: company.id,
      text: cleanedText,
      ratingMonth: ratingMonth.toISOString(),
    });

    // Small delay for consistency
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Recompute company month aggregates
    const { data: ratings } = await supaAdmin
      .from("Rating")
      .select("score")
      .eq("companyId", company.id)
      .eq("ratingMonth", ratingMonth.toISOString());

    const scores = (ratings ?? []).map((r: { score: number }) => r.score);
    const avgScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

    // Upsert company month
    const { data: existingMonth } = await supaAdmin
      .from("CompanyMonth")
      .select("id")
      .eq("companyId", company.id)
      .eq("month", ratingMonth.toISOString())
      .single();

    if (existingMonth) {
      await supaAdmin
        .from("CompanyMonth")
        .update({ avgScore, ratings: scores.length, updatedAt: new Date().toISOString() })
        .eq("id", existingMonth.id);
    } else {
      await supaAdmin.from("CompanyMonth").insert({
        companyId: company.id,
        month: ratingMonth.toISOString(),
        avgScore,
        ratings: scores.length,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch {
    return NextResponse.json({ error: "You already submitted a rating for this month." }, { status: 409 });
  }

  const summary = await buildCompanySummary(domain);
  return NextResponse.json(summary);
}
