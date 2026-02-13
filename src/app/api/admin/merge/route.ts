import { NextRequest, NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabaseAdmin";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { sourceCompanyId, targetCompanyId } = await request.json();

  // Update all ratings from source to target
  const { error: updateRatingsError } = await supaAdmin
    .from("Rating")
    .update({ companyId: targetCompanyId })
    .eq("companyId", sourceCompanyId);

  if (updateRatingsError) throw updateRatingsError;

  // Update all one things from source to target
  const { error: updateOneThingsError } = await supaAdmin
    .from("OneThing")
    .update({ companyId: targetCompanyId })
    .eq("companyId", sourceCompanyId);

  if (updateOneThingsError) throw updateOneThingsError;

  // Delete company months for source
  const { error: deleteMonthsError } = await supaAdmin
    .from("CompanyMonth")
    .delete()
    .eq("companyId", sourceCompanyId);

  if (deleteMonthsError) throw deleteMonthsError;

  // Delete source company
  const { error: deleteCompanyError } = await supaAdmin
    .from("Company")
    .delete()
    .eq("id", sourceCompanyId);

  if (deleteCompanyError) throw deleteCompanyError;

  return NextResponse.json({ ok: true });
}
