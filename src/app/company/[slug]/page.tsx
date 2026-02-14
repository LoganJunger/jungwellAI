import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkline } from "@/components/Sparkline";
import { findCompany } from "@/data/mockData";

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = findCompany(params.slug);
  if (!company) return notFound();

  return (
    <main>
      <div className="row">
        <img src={company.logoUrl} alt={`${company.name} logo`} className="logo" />
        <div>
          <h1>{company.name}</h1>
          <p className="muted">{company.domain}</p>
        </div>
      </div>

      {!company.privacyMet ? (
        <div className="panel">
          <h3>We have heard this CS team is 5 out of 5. Think different. Add your voice.</h3>
          <Link className="btn btn-primary" href="/rate">Rate this company</Link>
        </div>
      ) : (
        <>
          <div className="kpis">
            <div className="panel"><h3>{company.vScore?.toFixed(1)}</h3><p className="muted">V Score</p></div>
            <div className="panel"><h3>{company.ratingsCount}</h3><p className="muted">Total ratings</p></div>
            <div className="panel"><h3>{company.lastUpdated}</h3><p className="muted">Last updated</p></div>
          </div>
          <Sparkline points={company.trend} />
          <section className="panel">
            <h2>One thing managers can change</h2>
            <ul>{company.oneThings.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </>
      )}
    </main>
  );
}
