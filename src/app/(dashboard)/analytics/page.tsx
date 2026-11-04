import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, CheckCircle } from "lucide-react";

export default async function AnalyticsPage() {
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

  // Get basic stats
  let tasksQuery = supabase.from("tasks").select("*", { count: "exact" });
  if (!isAdmin) {
    tasksQuery = tasksQuery.eq("freelancer_id", user.id);
  }
  const { data: tasks, count: totalTasks } = await tasksQuery;

  const completedTasks = tasks?.filter((t) => t.status === "completed").length ?? 0;
  const inProgressTasks = tasks?.filter((t) => t.status === "in_progress").length ?? 0;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Analisis performa dan statistik
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Task</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{totalTasks}</p>
            </div>
            <div className="rounded-lg bg-muted p-2.5 text-blue-600">
              <BarChart3 className="size-5" aria-hidden />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Selesai</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{completedTasks}</p>
            </div>
            <div className="rounded-lg bg-muted p-2.5 text-green-600">
              <CheckCircle className="size-5" aria-hidden />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Dikerjakan</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{inProgressTasks}</p>
            </div>
            <div className="rounded-lg bg-muted p-2.5 text-orange-600">
              <Users className="size-5" aria-hidden />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Completion Rate</p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground">{completionRate}%</p>
            </div>
            <div className="rounded-lg bg-muted p-2.5 text-purple-600">
              <TrendingUp className="size-5" aria-hidden />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Task Distribution</h2>
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">Charts coming soon</p>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Performance Trend</h2>
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-sm text-muted-foreground">Charts coming soon</p>
        </div>
      </Card>
    </div>
  );
}
