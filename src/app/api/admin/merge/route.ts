import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { sourceCompanyId, targetCompanyId } = await request.json();

  await db.$transaction(async (tx) => {
    await tx.rating.updateMany({ where: { companyId: sourceCompanyId }, data: { companyId: targetCompanyId } });
    await tx.oneThing.updateMany({ where: { companyId: sourceCompanyId }, data: { companyId: targetCompanyId } });
    await tx.companyMonth.deleteMany({ where: { companyId: sourceCompanyId } });
    await tx.company.delete({ where: { id: sourceCompanyId } });
  });

  return NextResponse.json({ ok: true });
}
