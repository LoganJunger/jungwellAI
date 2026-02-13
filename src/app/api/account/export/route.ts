import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { email: session.email },
    include: {
      ratings: { include: { company: true }, orderBy: { createdAt: "desc" }, take: 100 },
      oneThings: { include: { company: true }, orderBy: { createdAt: "desc" }, take: 100 }
    }
  });

  return NextResponse.json({ exportedAt: new Date().toISOString(), user });
}
