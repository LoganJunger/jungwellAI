import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionUserFromRequest(request);
  if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  await db.oneThing.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
