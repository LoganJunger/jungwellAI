import { NextRequest, NextResponse } from "next/server";
import { supaAdmin } from "@/lib/supabaseAdmin";
import { getSessionUserFromRequest } from "@/lib/auth";

function ensureAdmin(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  return session?.isAdmin ? session : null;
}

export async function GET(request: NextRequest) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const q = request.nextUrl.searchParams.get("q") ?? "";

  let query = supaAdmin.from("Company").select("*");

  if (q) {
    query = query.or(`name.ilike.%${q}%,domain.ilike.%${q}%`);
  }

  const { data: companies, error } = await query
    .order("name", { ascending: true })
    .limit(50);

  if (error) return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });

  return NextResponse.json(companies);
}

export async function PATCH(request: NextRequest) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();

  const { data: updated, error } = await supaAdmin
    .from("Company")
    .update({
      name: body.name,
      domain: body.domain,
      logoUrl: body.logoUrl
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Failed to update company" }, { status: 500 });

  return NextResponse.json(updated);
}

export async function POST(request: NextRequest) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const rows = String(body.csv ?? "").split(/\r?\n/).slice(1).filter(Boolean);

  for (const line of rows) {
    const [name, domain, logoUrl] = line.split(",");
    if (!name || !domain) continue;

    const { data: existing } = await supaAdmin
      .from("Company")
      .select("id")
      .eq("domain", domain.trim().toLowerCase())
      .single();

    if (existing) {
      await supaAdmin
        .from("Company")
        .update({
          name: name.trim(),
          logoUrl: logoUrl?.trim() || null
        })
        .eq("domain", domain.trim().toLowerCase());
    } else {
      await supaAdmin
        .from("Company")
        .insert({
          name: name.trim(),
          domain: domain.trim().toLowerCase(),
          logoUrl: logoUrl?.trim() || null
        });
    }
  }

  return NextResponse.json({ ok: true, imported: rows.length });
}
