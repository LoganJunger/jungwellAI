import { NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabaseAdmin";
import { formatMonth } from "@/lib/time";

export async function GET(_: Request, { params }: { params: { domain: string } }) {
  const { data: company, error: companyError } = await supaAdmin
    .from("Company")
    .select("id")
    .eq("domain", params.domain.toLowerCase())
    .single();

  if (companyError || !company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const { data: months, error: monthsError } = await supaAdmin
    .from("CompanyMonth")
    .select("month, avgScore, ratings")
    .eq("companyId", company.id)
    .order("month", { ascending: false })
    .limit(12);

  if (monthsError) return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });

  return NextResponse.json(
    (months || [])
      .reverse()
      .map((m) => ({
        month: formatMonth(new Date(m.month)),
        avgScore: Number(m.avgScore.toFixed(2)),
        ratings: m.ratings
      }))
  );
}
