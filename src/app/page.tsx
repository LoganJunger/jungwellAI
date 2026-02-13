import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function HomePage() {
  return (
    <main className="space-y-6">
      <h1 className="text-4xl font-bold">The pulse of post-sales, in one number</h1>
      <p className="text-lg">Real CSM ratings. One question. Clear trends.</p>
      <div className="flex gap-3">
        <Link href="/companies" className="btn-primary">Find your company</Link>
        <Link href="/rate" className="rounded-xl border border-black/20 px-5 py-3">Rate your company</Link>
      </div>
      <section className="rounded-xl border border-black/10 bg-white p-4">
        <h2 className="text-xl font-semibold">About Jungwell</h2>
        <p>
          Var Nöjd is part of the Jungwell.ai workbench. Learn more at{" "}
          <a href={appConfig.jungwellUrl} className="underline">jungwell.com</a>.
        </p>
      </section>
    </main>
  );
}
