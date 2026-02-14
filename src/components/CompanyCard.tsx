import Link from "next/link";
import { CompanySummary } from "@/data/mockData";
import { LogoImage } from "@/components/LogoImage";

export function CompanyCard({ company }: { company: CompanySummary }) {
  return (
    <Link href={`/company/${company.domain.replace(/\./g, "-")}`} className="card">
      <div className="row">
        <LogoImage domain={company.domain} companyName={company.name} className="logo" />
        <div>
          <h3>{company.name}</h3>
          <p>{company.domain}</p>
        </div>
      </div>
      <div className="pill">{company.privacyMet ? `${company.vScore?.toFixed(1)} V Score` : "Private until 3 ratings"}</div>
    </Link>
  );
}
