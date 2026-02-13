import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-400">Last updated: February 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Identity Protection</h2>
          <p className="mt-3">Your identity is never exposed in public views. We use anonymous handles, and all feedback goes through automated PII stripping to remove emails, phone numbers, and other identifying information.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Privacy Floor</h2>
          <p className="mt-3">Company V Scores and individual feedback are only displayed after a minimum number of ratings have been submitted. This prevents identification of individual raters at smaller companies.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Data Collection</h2>
          <p className="mt-3">We collect your work email (to match you to your company), your rating score (1-5), and your optional text feedback. We do not sell your data to third parties.</p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-900">Your Rights</h2>
          <p className="mt-3">You can <Link href="/account" className="underline hover:text-gray-900">export or delete</Link> all your data at any time. Deletion is permanent and removes all your ratings and feedback.</p>
        </section>
      </div>
    </div>
  );
}
