import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { SubmissionForm } from "@/components/submissions/submission-form";

export default async function SubmitTaskPage({ params }: { params: Promise<{ id: string }> }) {
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

  // Get task
  const { data: task } = await supabase
    .from("tasks")
    .select("*, client:clients(*), freelancer:freelancers(*)")
    .eq("id", id)
    .single();

  if (!task) notFound();

  // Only assigned freelancer can submit
  if (profile?.role !== "admin" && task.freelancer_id !== user.id) {
    redirect("/tasks");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Kirim Submission</h1>
        <p className="text-sm text-muted-foreground">{task.title}</p>
      </div>

      <SubmissionForm taskId={id} freelancerId={task.freelancer_id ?? user.id} />
    </div>
  );
}
