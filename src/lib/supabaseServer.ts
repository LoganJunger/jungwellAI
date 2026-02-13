import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          try {
            cookieStore.set(name, value, options as any);
          } catch {
            // ignore – called from a Server Component
          }
        },
        remove(name: string, options: Record<string, unknown>) {
          try {
            cookieStore.set(name, "", options as any);
          } catch {
            // ignore – called from a Server Component
          }
        }
      }
    }
  );
}
