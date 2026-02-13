import { NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabaseAdmin";
import { currentUtcMonthStart } from "@/lib/time";
import { privacyFloor } from "@/lib/config";

export async function GET(_: Request, { params }: { params: { domain: string } }) {
  const { data: company, error: companyError } = await supaAdmin
    .from("Company")
    .select("id")
    .eq("domain", params.domain.toLowerCase())
    .single();

  if (companyError || !company) return NextResponse.json({ items: [] });

  const currentMonth = currentUtcMonthStart();

  const { data: month, error: monthError } = await supaAdmin
    .from("CompanyMonth")
    .select("ratings")
    .eq("companyId", company.id)
    .eq("month", currentMonth.toISOString())
    .single();

  if (monthError || !month || month.ratings < privacyFloor) return NextResponse.json({ items: [] });

  const { data: items, error: itemsError } = await supaAdmin
    .from("OneThing")
    .select("id, text, createdAt")
    .eq("companyId", company.id)
    .eq("ratingMonth", currentMonth.toISOString())
    .order("createdAt", { ascending: false })
    .limit(20);

  if (itemsError) return NextResponse.json({ items: [] });

  return NextResponse.json({ items });
}
