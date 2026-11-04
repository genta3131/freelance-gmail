import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ClientList } from "@/components/clients/client-list";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
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

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Build query
  let query = supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  const params = await searchParams;

  // Apply filters
  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,company.ilike.%${params.search}%`);
  }

  const { data: clients } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Client</h1>
          <p className="text-sm text-muted-foreground">Kelola database client Anda</p>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="size-4" aria-hidden />
            Tambah Client
          </Link>
        </Button>
      </div>

      <ClientList clients={clients ?? []} />
    </div>
  );
}
