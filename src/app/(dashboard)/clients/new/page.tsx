import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientForm } from "@/components/clients/client-form";

export default async function NewClientPage() {
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tambah Client Baru
        </h1>
        <p className="text-sm text-muted-foreground">Tambahkan client baru ke database Anda</p>
      </div>

      <ClientForm />
    </div>
  );
}
