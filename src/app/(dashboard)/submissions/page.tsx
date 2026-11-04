import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubmissionList } from "@/components/submissions/submission-list";
import { SUBMISSION_STATUSES } from "@/lib/constants";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
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
    .from("submissions")
    .select("*, task:tasks(*), freelancer:freelancers(*)")
    .order("created_at", { ascending: false });

  // Filter by user if not admin
  if (!isAdmin) {
    query = query.eq("freelancer_id", user.id);
  }

  const params = await searchParams;

  // Apply filters
  if (params.status && params.status !== "all") {
    const status = SUBMISSION_STATUSES.find(({ value }) => value === params.status)?.value;
    if (status) query = query.eq("status", status);
  }

  const { data: submissions } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Submission</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? "Review submission dari freelancer" : "Submission yang Anda kirim"}
          </p>
        </div>
      </div>

      <SubmissionList submissions={submissions ?? []} isAdmin={isAdmin} />
    </div>
  );
}
