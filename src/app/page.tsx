import Link from "next/link";
import { supaAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

async function getStats() {
  const { count: companyCount } = await supaAdmin
    .from("Company")
    .select("id", { count: "exact", head: true });

  const { count: ratingCount } = await supaAdmin
    .from("Rating")
    .select("id", { count: "exact", head: true });

  return { companyCount: companyCount ?? 0, ratingCount: ratingCount ?? 0 };
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #111 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              The pulse of post-sales,{" "}
              <span className="brand-gradient">in one number</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              Real CSM ratings. Anonymous feedback. Clear trends. Discover which Customer Success teams are thriving — and which ones need work.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/companies" className="btn-primary w-full px-8 py-4 text-base sm:w-auto">
                Explore companies
              </Link>
              <Link href="/rate" className="btn-secondary w-full px-8 py-4 text-base sm:w-auto">
                Rate your CS team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="text-center">
            <p className="text-3xl font-black brand-gradient">{stats.companyCount.toLocaleString()}</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Companies tracked</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black brand-gradient">{stats.ratingCount.toLocaleString()}</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Ratings submitted</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black brand-gradient">1–5</p>
            <p className="mt-1 text-sm font-medium text-gray-500">V Score scale</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black brand-gradient">100%</p>
            <p className="mt-1 text-sm font-medium text-gray-500">Anonymous</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">Three steps. One minute. Completely anonymous.</p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            { step: "1", title: "Find your company", desc: "Search our directory of CS teams or let us match you by your work email domain." },
            { step: "2", title: "Rate your experience", desc: "Answer one question: how happy are you as a CSM right now? Score 1–5, plus one suggestion." },
            { step: "3", title: "See the trends", desc: "Watch your company's V Score evolve. Compare across teams. Discover where CS thrives." }
          ].map((item) => (
            <div key={item.step} className="card p-6 text-center">
              <div className="brand-gradient-bg mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <span className="text-lg font-bold text-white">{item.step}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="brand-gradient-bg">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to add your voice?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">Your rating is anonymous and helps the entire CS community understand which teams are doing it right.</p>
          <Link href="/rate" className="mt-8 inline-flex items-center rounded-lg bg-white px-8 py-4 font-semibold text-gray-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
            Rate your company now
          </Link>
        </div>
      </section>
    </>
  );
}
