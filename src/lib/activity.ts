import { createClient as createClientServer } from "@/lib/supabase/server";
import { createClient as createClientBrowser } from "@/lib/supabase/client";
import type { ActivityAction, ActivityLog } from "@/types/database";

export interface ActivityInput {
  action: ActivityAction;
  entityType: "task" | "freelancer" | "client" | "submission" | "auth";
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Catat aktivitas ke activity_logs.
 * Harus dipanggil dari server (route handler / server action).
 * Gagal logging tidak boleh menggagalkan operasi utama.
 */
export async function logActivity(
  userId: string,
  action: ActivityAction,
  entityType: "task" | "freelancer" | "client" | "submission" | "auth",
  entityId?: string | null,
  metadata?: Record<string, unknown>
) {
  // Use client for browser context (called from client components)
  const supabase = createClientBrowser();

  const { error } = await supabase.from("activity_logs").insert({
    user_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    metadata: metadata ?? null,
  });

  if (error) {
    console.error("logActivity error:", error.message);
  }
}

export type { ActivityLog };
