import Link from "next/link";
import { TrendChart } from "@/components/TrendChart";
import { buildCompanySummary } from "@/lib/company";
import { supaAdmin } from "@/lib/supabaseAdmin";
import { privacyFloor } from "@/lib/config";
import { currentUtcMonthStart } from "@/lib/time";

export const dynamic = "force-dynamic";

async function getCompanyData(domain: string) {
  const summary = await buildCompanySummary(domain);
  if (!summary) return null;

  // Get company id for sub-queries
  const { data: company } = await supaAdmin
    .from("Company")
    .select("id")
    .eq("domain", domain)
    .single();

  if (!company) return null;

  // Fetch trend data
  const { data: trendRows } = await supaAdmin
    .from("CompanyMonth")
    .select("month, avgScore, ratings")
    .eq("companyId", company.id)
    .order("month", { ascending: true });

  const trend = (trendRows ?? []).map((t: { month: string; avgScore: number }) => ({
    month: t.month.slice(0, 7),
    avgScore: t.avgScore,
  }));

  // Fetch one-things for current month
  const month = currentUtcMonthStart().toISOString();
  const { data: oneThingRows } = await supaAdmin
    .from("OneThing")
    .select("id, text")
    .eq("companyId", company.id)
    .eq("ratingMonth", month)
    .order("createdAt", { ascending: false })
    .limit(20);

  return {
    summary,
    trend,
    oneThings: oneThingRows ?? [],
  };
}

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const data = await getCompanyData(params.slug);
  if (!data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-400">Company not found</h1>
        <Link href="/companies" className="btn-primary mt-6">Browse companies</Link>
      </div>
    );
  }

  const { summary, trend, oneThings } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/companies" className="hover:text-gray-600">Companies</Link>
        <span>/</span>
        <span className="text-gray-600">{summary.name}</span>
      </div>

      {/* Company header */}
      <div className="card mb-8 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
              {summary.logoUrl ? (
                <img src={summary.logoUrl} alt={summary.name} className="h-14 w-14 rounded-lg object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <span className="text-2xl font-bold text-gray-300">{summary.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{summary.name}</h1>
              <p className="mt-1 text-sm text-gray-400">{summary.domain}</p>
            </div>
          </div>

          {summary.privacyMet && summary.vScore ? (
            <div className="text-center sm:text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">V Score</p>
              <p className="score-badge-lg mt-1">{summary.vScore.toFixed(1)}</p>
              <p className="mt-2 text-xs text-gray-400">{summary.ratingsCount} ratings</p>
            </div>
          ) : null}
        </div>
      </div>

      {!summary.privacyMet ? (
        /* Not enough ratings */
        <div className="card p-8 text-center sm:p-12">
          <div className="brand-gradient-bg mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          </div>
          <h2 className="mt-6 text-xl font-bold">Be one of the first to rate this CS team</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-500">
            We need at least {privacyFloor} ratings before we can show the V Score. Your anonymous feedback helps the whole community.
          </p>
          <Link href="/rate" className="btn-primary mt-8">Rate this company</Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Score cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-400">Overall V Score</h3>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-5xl font-black brand-gradient">{summary.vScore?.toFixed(1)}</span>
                <span className="mb-1 text-sm text-gray-400">/ 5.0</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="brand-gradient-bg h-full rounded-full" style={{ width: `${((summary.vScore ?? 0) / 5) * 100}%` }} />
              </div>
              <p className="mt-3 text-xs text-gray-400">Based on {summary.ratingsCount} anonymous ratings</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-400">Quick stats</h3>
              <dl className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">Total ratings</dt>
                  <dd className="font-semibold">{summary.ratingsCount}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-500">Trend data points</dt>
                  <dd className="font-semibold">{trend.length}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Chart + One things */}
          <div className="space-y-6 lg:col-span-2">
            {trend.length > 0 && (
              <div className="card p-6">
                <h3 className="mb-4 text-sm font-medium text-gray-400">Score Trend</h3>
                <TrendChart data={trend} />
              </div>
            )}
            <div className="card p-6">
              <h3 className="mb-4 text-sm font-medium text-gray-400">What CSMs are saying this month</h3>
              {oneThings.length > 0 ? (
                <ul className="space-y-3">
                  {oneThings.map((item: { id: string; text: string }) => (
                    <li key={item.id} className="rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                      &ldquo;{item.text}&rdquo;
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No feedback submitted this month yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rate CTA */}
      <div className="mt-8 card p-6 text-center">
        <p className="font-medium">Work here? <Link href="/rate" className="brand-gradient font-semibold hover:underline">Add your anonymous rating</Link></p>
      </div>
    </div>
  );
}
