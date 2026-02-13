import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { supaAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: user, error: userError } = await supaAdmin
    .from("User")
    .select("*")
    .eq("email", session.email)
    .single();

  if (userError || !user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { data: ratings, error: ratingsError } = await supaAdmin
    .from("Rating")
    .select("*, Company(*)")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false })
    .limit(100);

  if (ratingsError) return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });

  const { data: oneThings, error: oneThingsError } = await supaAdmin
    .from("OneThing")
    .select("*, Company(*)")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false })
    .limit(100);

  if (oneThingsError) return NextResponse.json({ error: "Failed to fetch one things" }, { status: 500 });

  const exportedUser = {
    ...user,
    ratings: ratings || [],
    oneThings: oneThings || []
  };

  return NextResponse.json({ exportedAt: new Date().toISOString(), user: exportedUser });
}
