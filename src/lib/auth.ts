import { NextRequest } from "next/server";
import { adminEmails, blockedDomains } from "@/lib/config";
import { db } from "@/lib/db";
import { generateHandle } from "@/utils/handleGenerator";

export type SessionUser = {
  email: string;
  emailDomain: string;
  isAdmin: boolean;
};

export function getEmailDomain(email: string) {
  return email.toLowerCase().split("@")[1] ?? "";
}

export function isWorkEmail(email: string) {
  const domain = getEmailDomain(email);
  return Boolean(domain) && !blockedDomains.has(domain);
}

export function getSessionUserFromRequest(request: NextRequest): SessionUser | null {
  const email = request.headers.get("x-user-email")?.toLowerCase() ?? "";
  if (!email || !isWorkEmail(email)) return null;
  return {
    email,
    emailDomain: getEmailDomain(email),
    isAdmin: adminEmails.has(email)
  };
}

export async function upsertUserFromEmail(email: string) {
  const normalized = email.toLowerCase();
  const emailDomain = getEmailDomain(normalized);
  if (!isWorkEmail(normalized)) {
    throw new Error("Please use your work email.");
  }

  const existing = await db.user.findUnique({ where: { email: normalized } });
  if (existing) return existing;

  const handles = new Set((await db.user.findMany({ select: { handle: true } })).map((u) => u.handle));
  return db.user.create({
    data: {
      email: normalized,
      emailDomain,
      handle: generateHandle(handles),
      isAdmin: adminEmails.has(normalized)
    }
  });
}
