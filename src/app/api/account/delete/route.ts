import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { supaAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: user, error: userError } = await supaAdmin
    .from("User")
    .select("id")
    .eq("email", session.email)
    .single();

  if (userError || !user) return NextResponse.json({ ok: true });

  // Delete ratings
  const { error: deleteRatingsError } = await supaAdmin
    .from("Rating")
    .delete()
    .eq("userId", user.id);

  if (deleteRatingsError) throw deleteRatingsError;

  // Delete one things
  const { error: deleteOneThingsError } = await supaAdmin
    .from("OneThing")
    .delete()
    .eq("userId", user.id);

  if (deleteOneThingsError) throw deleteOneThingsError;

  // Delete user
  const { error: deleteUserError } = await supaAdmin
    .from("User")
    .delete()
    .eq("id", user.id);

  if (deleteUserError) throw deleteUserError;

  return NextResponse.json({ ok: true });
}
