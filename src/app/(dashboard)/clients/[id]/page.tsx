import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Building2, Edit } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
    redirect("/clients");
  }

  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();

  if (!client) notFound();

  // Get tasks for this client
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("client_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{client.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Detail client</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/clients/${id}/edit`}>
            <Edit className="size-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold text-foreground">Informasi Client</h2>
        <div className="space-y-3">
          {client.company && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Perusahaan</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <Building2 className="size-3.5" />
                {client.company}
              </div>
            </div>
          )}

          {client.email && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Email</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <Mail className="size-3.5" />
                {client.email}
              </div>
            </div>
          )}

          {client.phone && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Telepon</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <Phone className="size-3.5" />
                {client.phone}
              </div>
            </div>
          )}

          {client.notes && (
            <div>
              <p className="text-xs font-medium text-muted-foreground">Catatan</p>
              <p className="mt-1 text-sm text-foreground">{client.notes}</p>
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
            Belum ada task untuk client ini
          </p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent"
              >
                <p className="text-sm font-medium text-foreground">{task.title}</p>
                {task.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
