import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUserFromRequest } from "@/lib/auth";

function ensureAdmin(request: NextRequest) {
  const session = getSessionUserFromRequest(request);
  return session?.isAdmin ? session : null;
}

export async function GET(request: NextRequest) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const companies = await db.company.findMany({
    where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { domain: { contains: q, mode: "insensitive" } }] } : undefined,
    take: 50,
    orderBy: { name: "asc" }
  });
  return NextResponse.json(companies);
}

export async function PATCH(request: NextRequest) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const updated = await db.company.update({
    where: { id: body.id },
    data: { name: body.name, domain: body.domain, logoUrl: body.logoUrl }
  });
  return NextResponse.json(updated);
}

export async function POST(request: NextRequest) {
  if (!ensureAdmin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json();
  const rows = String(body.csv ?? "").split(/\r?\n/).slice(1).filter(Boolean);
  for (const line of rows) {
    const [name, domain, logoUrl] = line.split(",");
    if (!name || !domain) continue;
    await db.company.upsert({
      where: { domain: domain.trim().toLowerCase() },
      update: { name: name.trim(), logoUrl: logoUrl?.trim() || null },
      create: { name: name.trim(), domain: domain.trim().toLowerCase(), logoUrl: logoUrl?.trim() || null }
    });
  }
  return NextResponse.json({ ok: true, imported: rows.length });
}
