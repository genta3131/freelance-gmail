import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { TaskList } from "@/components/tasks/task-list";
import { redirect } from "next/navigation";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; priority?: string; search?: string }>;
}) {
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
    .from("tasks")
    .select("*, client:clients(*), freelancer:freelancers(*)")
    .order("created_at", { ascending: false });

  // Filter by user if not admin
  if (!isAdmin) {
    query = query.eq("freelancer_id", user.id);
  }

  const params = await searchParams;

  // Apply filters
  if (params.status) {
    const status = TASK_STATUSES.find(({ value }) => value === params.status)?.value;
    if (status) query = query.eq("status", status);
  }
  if (params.priority) {
    const priority = TASK_PRIORITIES.find(({ value }) => value === params.priority)?.value;
    if (priority) query = query.eq("priority", priority);
  }
  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  const { data: tasks } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Task</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? "Kelola semua task project Anda" : "Task yang ditugaskan kepada Anda"}
          </p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/tasks/new">
              <Plus className="size-4" aria-hidden />
              Buat Task
            </Link>
          </Button>
        )}
      </div>

      <TaskList tasks={tasks ?? []} isAdmin={isAdmin} />
    </div>
  );
}
