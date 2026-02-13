import { supaAdmin } from "@/lib/supabaseAdmin";
import { currentUtcMonthStart } from "@/lib/time";

export async function recomputeMonth(month: Date) {
  const { data: companies, error: companiesError } = await supaAdmin
    .from("Company")
    .select("id");

  if (companiesError) throw companiesError;

  for (const company of companies || []) {
    const { data: ratings, error: ratingsError } = await supaAdmin
      .from("Rating")
      .select("score")
      .eq("companyId", company.id)
      .eq("ratingMonth", month.toISOString());

    if (ratingsError) throw ratingsError;

    const ratingCount = ratings?.length || 0;
    if (!ratingCount) continue;

    const avgScore = ratings && ratings.length > 0
      ? ratings.reduce((sum: number, r: any) => sum + (r.score || 0), 0) / ratings.length
      : 0;

    const { data: existing } = await supaAdmin
      .from("CompanyMonth")
      .select("id")
      .eq("companyId", company.id)
      .eq("month", month.toISOString())
      .single();

    if (existing) {
      const { error: updateError } = await supaAdmin
        .from("CompanyMonth")
        .update({
          avgScore,
          ratings: ratingCount
        })
        .eq("companyId", company.id)
        .eq("month", month.toISOString());

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supaAdmin
        .from("CompanyMonth")
        .insert({
          companyId: company.id,
          month: month.toISOString(),
          avgScore,
          ratings: ratingCount
        });

      if (insertError) throw insertError;
    }
  }
}

export async function backfillLast12MonthsIfEmpty() {
  const { count, error: countError } = await supaAdmin
    .from("CompanyMonth")
    .select("id", { count: "exact" });

  if (countError) throw countError;

  if ((count ?? 0) > 0) return;

  const current = currentUtcMonthStart();
  for (let i = 0; i < 12; i += 1) {
    const month = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - i, 1));
    await recomputeMonth(month);
  }
}
