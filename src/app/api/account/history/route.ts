import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) return NextResponse.json({ ratings: [] }, { status: 401 });
  const user = await db.user.findUnique({ where: { email: session.email } });
  if (!user) return NextResponse.json({ ratings: [] });
  const ratings = await db.rating.findMany({ where: { userId: user.id }, include: { company: true }, orderBy: { createdAt: "desc" }, take: 12 });
  return NextResponse.json({ ratings });
}
