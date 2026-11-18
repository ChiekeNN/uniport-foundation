// Supabase parity utilities.
// Primary data access in this deployment uses Drizzle ORM (`src/db`) against PostgreSQL.
// These helpers expose Supabase-compatible client/server accessors so the codebase
// remains drop-in compatible with a hosted Supabase project (per UPHF spec).

import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function supabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
}

function supabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

export function createSupabaseBrowserClient() {
  const url = supabaseUrl() || "https://placeholder.supabase.co";
  const key = supabaseAnonKey() || "placeholder-anon-key";
  return createBrowserClient(url, key);
}

export async function createSupabaseServerClient() {
  const url = supabaseUrl() || "https://placeholder.supabase.co";
  const key = supabaseAnonKey() || "placeholder-anon-key";
  const cookieStore = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Server Component context — cookies are read-only; middleware handles writes.
        }
      },
    },
  });
}
