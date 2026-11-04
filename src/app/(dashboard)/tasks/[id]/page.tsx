import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Building2, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/constants";
import { TaskDeleteButton } from "@/components/tasks/task-delete-button";
import { cn } from "@/lib/utils";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const { data: task } = await supabase
    .from("tasks")
    .select("*, client:clients(*), freelancer:freelancers(*)")
    .eq("id", id)
    .single();

  if (!task) notFound();

  // Non-admin hanya bisa lihat task mereka sendiri
  if (!isAdmin && task.freelancer_id !== user.id) {
    redirect("/tasks");
  }

  // Get submissions for this task
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, freelancer:freelancers(*)")
    .eq("task_id", id)
    .order("created_at", { ascending: false });

  const statusInfo = TASK_STATUSES.find((s) => s.value === task.status);
  const priorityInfo = TASK_PRIORITIES.find((p) => p.value === task.priority);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {task.title}
            </h1>
            <Badge
              className={cn(
                statusInfo?.value === "completed" && "bg-green-600",
                statusInfo?.value === "in_progress" && "bg-blue-600",
                statusInfo?.value === "pending" && "bg-yellow-600",
                statusInfo?.value === "review" && "bg-purple-600",
                statusInfo?.value === "rejected" && "bg-red-600",
              )}
            >
              {statusInfo?.label}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Detail task dan progress</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/tasks/${id}/edit`}>
                <Edit className="size-4" />
                Edit
              </Link>
            </Button>
            <TaskDeleteButton taskId={id} />
          </div>
        )}
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Informasi Task</h2>
        <div className="space-y-3">
          {task.description && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Deskripsi</p>
              <p className="mt-1 text-sm text-foreground">{task.description}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Prioritas</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    task.priority === "urgent" && "bg-red-500",
                    task.priority === "high" && "bg-orange-500",
                    task.priority === "medium" && "bg-yellow-500",
                    task.priority === "low" && "bg-green-500",
                  )}
                />
                <span className="text-sm text-foreground">{priorityInfo?.label}</span>
              </div>
            </div>

            {task.due_date && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Deadline</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                  <Calendar className="size-3.5" />
                  {new Date(task.due_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}

            {task.freelancer && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Freelancer</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                  <User className="size-3.5" />
                  {task.freelancer.name}
                </div>
              </div>
            )}

            {task.client && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Client</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                  <Building2 className="size-3.5" />
                  {task.client.name}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Dibuat</p>
              <p className="mt-1 text-sm text-foreground">
                {new Date(task.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Update Terakhir</p>
              <p className="mt-1 text-sm text-foreground">
                {new Date(task.updated_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Submissions */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Submission ({submissions?.length ?? 0})
          </h2>
          {!isAdmin && task.freelancer_id === user.id && (
            <Button asChild size="sm">
              <Link href={`/tasks/${id}/submit`}>Kirim Submission</Link>
            </Button>
          )}
        </div>

        {!submissions || submissions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Belum ada submission untuk task ini
          </p>
        ) : (
          <div className="space-y-3">
            {submissions.map((sub) => (
              <Link
                key={sub.id}
                href={`/submissions/${sub.id}`}
                className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {sub.freelancer?.name ?? "Unknown"}
                      </p>
                      <Badge
                        variant={
                          sub.status === "approved"
                            ? "success"
                            : sub.status === "rejected"
                              ? "destructive"
                              : "default"
                        }
                      >
                        {sub.status === "approved"
                          ? "Disetujui"
                          : sub.status === "rejected"
                            ? "Ditolak"
                            : "Pending"}
                      </Badge>
                    </div>
                    {sub.notes && (
                      <p className="mt-1 text-xs text-muted-foreground">{sub.notes}</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
