import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { supaAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  if (!session) return NextResponse.json({ ratings: [] }, { status: 401 });

  const { data: user, error: userError } = await supaAdmin
    .from("User")
    .select("id")
    .eq("email", session.email)
    .single();

  if (userError || !user) return NextResponse.json({ ratings: [] });

  const { data: ratings, error: ratingsError } = await supaAdmin
    .from("Rating")
    .select("*, Company(*)")
    .eq("userId", user.id)
    .order("createdAt", { ascending: false })
    .limit(12);

  if (ratingsError) return NextResponse.json({ ratings: [] });

  return NextResponse.json({ ratings });
}
