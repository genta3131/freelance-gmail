import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FreelancerForm } from "@/components/freelancers/freelancer-form";

export default async function NewFreelancerPage() {
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tambah Freelancer Baru
        </h1>
        <p className="text-sm text-muted-foreground">Tambahkan freelancer baru ke database Anda</p>
      </div>

      <FreelancerForm />
    </div>
  );
}
