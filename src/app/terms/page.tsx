import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: February 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">1. Overview</h2>
          <p className="mt-3">Var Nöjd collects monthly Customer Success sentiment from verified work-email users. Ratings and feedback are anonymous and aggregated to produce company-level V Scores.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">2. Privacy & Anonymity</h2>
          <p className="mt-3">We assign random anonymous handles to all users. Profanity is masked and personally identifiable information (emails, phone numbers) is automatically stripped from all feedback text. Company scores and feedback are only displayed once a minimum privacy threshold is met.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">3. Acceptable Use</h2>
          <p className="mt-3">You agree to provide honest feedback about your own workplace experience. Manipulation of ratings, impersonation, or harassment through feedback text is prohibited and may result in account removal.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">4. Data Rights</h2>
          <p className="mt-3">You can export your data or delete your account at any time from the <Link href="/account" className="underline hover:text-gray-900">account page</Link>.</p>
        </section>
      </div>
    </div>
  );
}
