import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TaskForm } from "@/components/tasks/task-form";

export default async function NewTaskPage() {
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

  if (profile?.role !== "admin") {
    redirect("/tasks");
  }

  // Get clients and freelancers for select options
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  const { data: freelancers } = await supabase
    .from("freelancers")
    .select("*")
    .eq("status", "active")
    .order("name");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Buat Task Baru</h1>
        <p className="text-sm text-muted-foreground">
          Tambahkan task baru untuk freelancer Anda
        </p>
      </div>

      <TaskForm clients={clients ?? []} freelancers={freelancers ?? []} />
    </div>
  );
}
