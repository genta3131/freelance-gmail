import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ActivityList } from "@/components/activity/activity-list";

export default async function ActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  // Build query
  let query = supabase
    .from("activity_logs")
    .select("*, user:profiles(*)")
    .order("created_at", { ascending: false })
    .limit(50);

  // Non-admin only see their own activity
  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: activities } = await query;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Aktivitas</h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin ? "Log aktivitas dari semua pengguna" : "Riwayat aktivitas Anda"}
        </p>
      </div>

      <ActivityList activities={activities ?? []} />
    </div>
  );
}
