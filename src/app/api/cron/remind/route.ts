import { NextRequest, NextResponse } from "next/server";
import { getReminderRecipients } from "@/lib/reminders";

function authorized(request: NextRequest) {
  return request.headers.get("x-cron-secret") === process.env.CRON_SECRET;
}

async function sendViaResend(to: string[]) {
  const key = process.env.RESEND_API_KEY;
  if (!key || to.length === 0) return { mode: "log", recipients: to };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Var Nöjd <noreply@jungwell.com>", to, subject: "Time for your monthly V Score check-in", text: "Share one rating and one action to improve your team." })
  });
  return { mode: "resend", ok: response.ok };
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const recipients = await getReminderRecipients();
  const result = await sendViaResend(recipients);
  return NextResponse.json({ recipients, result });
}
