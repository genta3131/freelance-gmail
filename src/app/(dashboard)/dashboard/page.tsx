import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { SquareCheckBig, UsersRound, FileCheck2, Building2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TASK_STATUSES } from "@/lib/constants";
import type { Task } from "@/types/database";

async function getDashboardStats(userId: string, isAdmin: boolean) {
  const supabase = await createClient();

  // Get tasks
  let tasksQuery = supabase.from("tasks").select("*", { count: "exact" });
  if (!isAdmin) {
    tasksQuery = tasksQuery.eq("freelancer_id", userId);
  }
  const { data: tasks, count: totalTasks } = await tasksQuery;

  // Get submissions
  let submissionsQuery = supabase.from("submissions").select("*", { count: "exact" });
  if (!isAdmin) {
    submissionsQuery = submissionsQuery.eq("freelancer_id", userId);
  }
  const { data: submissions, count: totalSubmissions } = await submissionsQuery;

  // Admin-only stats
  let totalFreelancers = 0;
  let totalClients = 0;
  if (isAdmin) {
    const { count: freelancersCount } = await supabase
      .from("freelancers")
      .select("*", { count: "exact", head: true });
    const { count: clientsCount } = await supabase
      .from("clients")
      .select("*", { count: "exact", head: true });
    totalFreelancers = freelancersCount ?? 0;
    totalClients = clientsCount ?? 0;
  }

  // Task stats by status
  const tasksByStatus = TASK_STATUSES.map((status) => ({
    ...status,
    count: tasks?.filter((t) => t.status === status.value).length ?? 0,
  }));

  // Pending submissions
  const pendingSubmissions = submissions?.filter((s) => s.status === "pending").length ?? 0;

  return {
    totalTasks: totalTasks ?? 0,
    totalSubmissions: totalSubmissions ?? 0,
    totalFreelancers,
    totalClients,
    tasksByStatus,
    pendingSubmissions,
    recentTasks: (tasks ?? []).slice(0, 5),
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const stats = await getDashboardStats(user.id, isAdmin);

  const statCards = [
    {
      label: "Total Task",
      value: stats.totalTasks,
      icon: SquareCheckBig,
      href: "/tasks",
      color: "text-brand",
    },
    {
      label: "Total Submission",
      value: stats.totalSubmissions,
      icon: FileCheck2,
      href: "/submissions",
      color: "text-blue-600 dark:text-blue-400",
    },
    ...(isAdmin
      ? [
          {
            label: "Total Freelancer",
            value: stats.totalFreelancers,
            icon: UsersRound,
            href: "/freelancers",
            color: "text-green-600 dark:text-green-400",
          },
          {
            label: "Total Client",
            value: stats.totalClients,
            icon: Building2,
            href: "/clients",
            color: "text-purple-600 dark:text-purple-400",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin ? "Overview manajemen freelance Anda" : "Overview task dan submission Anda"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
                  <p className="mt-1.5 text-2xl font-semibold text-foreground">{card.value}</p>
                </div>
                <div className={cn("rounded-lg bg-muted p-2.5", card.color)}>
                  <card.icon className="size-5" aria-hidden />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Task Status Overview */}
      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Status Task</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.tasksByStatus.map((status) => (
            <div key={status.value} className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{status.label}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{status.count}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Tasks */}
      {stats.recentTasks.length > 0 && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Task Terbaru</h2>
            <Link
              href="/tasks"
              className="text-xs font-medium text-brand transition-colors hover:text-brand/80"
            >
              Lihat semua
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentTasks.map((task) => {
              const statusInfo = TASK_STATUSES.find((s) => s.value === task.status);
              return (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{task.title}</p>
                      {task.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                      {statusInfo?.label ?? task.status}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      )}

      {/* Pending Submissions Alert */}
      {isAdmin && stats.pendingSubmissions > 0 && (
        <Card className="border-brand/30 bg-brand/5 p-4">
          <div className="flex items-center gap-3">
            <FileCheck2 className="size-5 shrink-0 text-brand" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                Ada {stats.pendingSubmissions} submission menunggu review
              </p>
              <p className="text-xs text-muted-foreground">
                Periksa dan berikan feedback untuk submission yang masuk
              </p>
            </div>
            <Link
              href="/submissions"
              className="shrink-0 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand/90"
            >
              Review
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
