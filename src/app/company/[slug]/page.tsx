import Link from "next/link";
import { TrendChart } from "@/components/TrendChart";

async function getData(slug: string) {
  const [summaryRes, trendRes, oneThingRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/company/${slug}/summary`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/company/${slug}/trend`, { cache: "no-store" }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/company/${slug}/one-things`, { cache: "no-store" })
  ]);
  return { summary: await summaryRes.json(), trend: await trendRes.json(), oneThings: await oneThingRes.json() };
}

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug);
  if (data.summary.error) return <p>Company not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {data.summary.logoUrl ? <img src={data.summary.logoUrl} alt={data.summary.name} className="h-10 w-10 rounded" /> : null}
        <div>
          <h1 className="text-2xl font-bold">{data.summary.name}</h1>
          <p className="text-sm text-black/70">{data.summary.domain}</p>
        </div>
      </div>

      {!data.summary.privacyMet ? (
        <div className="rounded-xl border bg-white p-4">
          <p>We have heard this CS team is 5 out of 5. Think different. Add your voice.</p>
          <Link href="/rate" className="btn-primary mt-3">Rate your company</Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-black/60">V Score</p>
            <p className="text-3xl font-bold">{data.summary.vScore?.toFixed(1)}</p>
            <p className="text-sm">{data.summary.ratingsCount} ratings · updated {data.summary.lastUpdated ?? "-"}</p>
          </div>
          <div className="rounded-xl border bg-white p-4"><TrendChart data={data.trend} /></div>
          <div className="rounded-xl border bg-white p-4">
            <h2 className="mb-2 text-lg font-semibold">One thing (this month)</h2>
            <ul className="space-y-2">
              {(data.oneThings.items ?? []).map((item: { id: string; text: string }) => <li key={item.id}>• {item.text}</li>)}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
