import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest, upsertUserFromEmail } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) return NextResponse.json({ user: null });
  const user = await upsertUserFromEmail(session.email);
  return NextResponse.json({ user: { email: user.email, handle: user.handle, emailDomain: user.emailDomain, isAdmin: user.isAdmin } });
}
