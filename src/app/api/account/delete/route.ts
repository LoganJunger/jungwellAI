import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { email: session.email } });
  if (!user) return NextResponse.json({ ok: true });

  await db.$transaction(async (tx) => {
    await tx.rating.deleteMany({ where: { userId: user.id } });
    await tx.oneThing.deleteMany({ where: { userId: user.id } });
    await tx.user.delete({ where: { id: user.id } });
  });

  return NextResponse.json({ ok: true });
}
