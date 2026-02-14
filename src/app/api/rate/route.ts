import { NextRequest, NextResponse } from "next/server";
import { addRating } from "@/lib/store";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body?.domain || !body?.score) {
    return NextResponse.json({ error: "domain and score are required" }, { status: 400 });
  }

  const result = addRating({ domain: String(body.domain), score: Number(body.score), text: String(body.text ?? "") });
  return NextResponse.json(result, { status: 200 });
}
