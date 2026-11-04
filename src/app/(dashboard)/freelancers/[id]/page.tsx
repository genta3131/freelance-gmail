import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, DollarSign, Edit, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default async function FreelancerDetailPage({
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

  if (profile?.role !== "admin") {
    redirect("/freelancers");
  }

  const { data: freelancer } = await supabase
    .from("freelancers")
    .select("*")
    .eq("id", id)
    .single();

  if (!freelancer) notFound();

  // Get tasks for this freelancer
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("freelancer_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {freelancer.name}
            </h1>
            {freelancer.status === "active" ? (
              <CheckCircle2 className="size-5 text-green-500" />
            ) : (
              <XCircle className="size-5 text-muted-foreground" />
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Detail freelancer</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/freelancers/${id}/edit`}>
            <Edit className="size-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Informasi Freelancer</h2>
        <div className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Status</p>
              <Badge variant={freelancer.status === "active" ? "success" : "default"} className="mt-1">
                {freelancer.status === "active" ? "Aktif" : "Tidak Aktif"}
              </Badge>
            </div>

            {freelancer.hourly_rate && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Hourly Rate</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                  <DollarSign className="size-3.5" />
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(freelancer.hourly_rate)}
                </div>
              </div>
            )}
          </div>

          {freelancer.email && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Email</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <Mail className="size-3.5" />
                {freelancer.email}
              </div>
            </div>
          )}

          {freelancer.phone && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Phone</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <Phone className="size-3.5" />
                {freelancer.phone}
              </div>
            </div>
          )}

          {freelancer.skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {freelancer.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tasks */}
      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">
          Task ({tasks?.length ?? 0})
        </h2>

        {!tasks || tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Belum ada task untuk freelancer ini
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <Badge>{task.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
