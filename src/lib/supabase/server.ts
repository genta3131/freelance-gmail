import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

/**
 * Client untuk Server Components, Route Handlers, dan Server Actions.
 * Menggunakan cookies() async (Next.js 16) — service role tidak pernah
 * dipakai di sini kecuali melalui fungsi admin yang khusus.
 */
export async function createServerClientWithOptions() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Dipanggil dari Server Component — aman diabaikan karena
            // refresh session ditangani oleh proxy.ts.
          }
        },
      },
      auth: {
        flowType: "pkce",
      },
    },
  );
}

export const createClient = createServerClientWithOptions;
