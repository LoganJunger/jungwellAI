import Link from "next/link";
import { CompanyCard } from "@/components/CompanyCard";
import { companies } from "@/data/mockData";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <p className="muted">A Jungwell.ai Workbench module</p>
        <h1>The pulse of post-sales, in one number</h1>
        <p className="sub">Real CSM ratings. One question. Clear trends. Track CS team happiness and act on what improves it.</p>
        <div className="actions">
          <Link className="btn btn-primary" href="/companies">Find your company</Link>
          <Link className="btn" href="/rate">Rate your company</Link>
        </div>
      </section>
      <section>
        <h2>Featured companies</h2>
        <div className="grid">{companies.map((company) => <CompanyCard key={company.domain} company={company} />)}</div>
      </section>
    </main>
  );
}
