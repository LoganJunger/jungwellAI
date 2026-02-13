import { NextRequest } from "next/server";
import { adminEmails, blockedDomains } from "@/lib/config";
import { supaAdmin } from "@/lib/supabaseAdmin";
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
    isAdmin: adminEmails.has(email),
  };
}

export async function upsertUserFromEmail(email: string) {
  const normalized = email.toLowerCase();
  const emailDomain = getEmailDomain(normalized);
  if (!isWorkEmail(normalized)) {
    throw new Error("Please use your work email.");
  }

  // Check if user already exists
  const { data: existing } = await supaAdmin
    .from("User")
    .select("*")
    .eq("email", normalized)
    .single();

  if (existing) return existing;

  // Generate a unique handle
  const { data: allHandles } = await supaAdmin
    .from("User")
    .select("handle");

  const handleSet = new Set((allHandles ?? []).map((u: { handle: string }) => u.handle));
  const handle = generateHandle(handleSet);

  const { data: newUser, error } = await supaAdmin
    .from("User")
    .insert({
      email: normalized,
      emailDomain,
      handle,
      isAdmin: adminEmails.has(normalized),
    })
    .select()
    .single();

  if (error) throw new Error("Failed to create user: " + error.message);
  return newUser;
}
