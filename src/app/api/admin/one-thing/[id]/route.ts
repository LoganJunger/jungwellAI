import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth";
import { supaAdmin } from "@/lib/supabaseAdmin";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = getSessionUserFromRequest(request);
  if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await supaAdmin
    .from("OneThing")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
