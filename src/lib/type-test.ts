import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type AsType = { [K in keyof Database]: Database[K] };

export async function tests() {
  const c = createClient<AsType>("http://localhost", "k");
  await c.from("activity_logs").insert({ user_id: "x", action: "task_created", entity_type: "task" });
}
