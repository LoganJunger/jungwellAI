import Link from "next/link";
import { CompanySummary } from "@/data/mockData";

export function CompanyCard({ company }: { company: CompanySummary }) {
  return (
    <Link href={`/company/${company.domain.replace(/\./g, "-")}`} className="card">
      <div className="row">
        <img src={company.logoUrl} alt={`${company.name} logo`} className="logo" />
        <div>
          <h3>{company.name}</h3>
          <p>{company.domain}</p>
        </div>
      </div>
      <div className="pill">{company.privacyMet ? `${company.vScore?.toFixed(1)} V Score` : "Private until 3 ratings"}</div>
    </Link>
  );
}
