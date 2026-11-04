import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText, Download } from "lucide-react";
import Link from "next/link";
import { SubmissionReviewForm } from "@/components/submissions/submission-review-form";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { data: submission } = await supabase
    .from("submissions")
    .select("*, task:tasks(*), freelancer:freelancers(*)")
    .eq("id", id)
    .single();

  if (!submission) notFound();

  // Non-admin only can see their own submissions
  if (!isAdmin && submission.freelancer_id !== user.id) {
    redirect("/submissions");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Detail Submission
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {submission.task?.title ?? "Unknown Task"}
          </p>
        </div>
        <Badge
          variant={
            submission.status === "approved"
              ? "success"
              : submission.status === "rejected"
                ? "destructive"
                : "default"
          }
        >
          {submission.status === "approved"
            ? "Disetujui"
            : submission.status === "rejected"
              ? "Ditolak"
              : "Pending"}
        </Badge>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Informasi Submission</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Task</p>
            <Link
              href={`/tasks/${submission.task_id}`}
              className="mt-1 block text-sm text-brand hover:underline"
            >
              {submission.task?.title ?? "Unknown"}
            </Link>
          </div>

          {submission.freelancer && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Freelancer</p>
              <p className="mt-1 text-sm text-foreground">{submission.freelancer.name}</p>
            </div>
          )}

          {submission.notes && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Catatan</p>
              <p className="mt-1 text-sm text-foreground">{submission.notes}</p>
            </div>
          )}

          {submission.file_url && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">File</p>
              <Button asChild variant="outline" size="sm" className="mt-1">
                <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="size-4" />
                  Download File
                </a>
              </Button>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tanggal Submit</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <Calendar className="size-3.5" />
                {new Date(submission.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {submission.reviewed_at && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Tanggal Review</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                  <Calendar className="size-3.5" />
                  {new Date(submission.reviewed_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>

          {submission.feedback && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Feedback</p>
              <p className="mt-1 text-sm text-foreground">{submission.feedback}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Review Form (Admin Only) */}
      {isAdmin && submission.status === "pending" && (
        <SubmissionReviewForm submissionId={submission.id} />
      )}
    </div>
  );
}
