import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { FreelancerForm } from "@/components/freelancers/freelancer-form";

export default async function EditFreelancerPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Freelancer</h1>
        <p className="text-sm text-muted-foreground">Update informasi freelancer</p>
      </div>

      <FreelancerForm freelancer={freelancer} />
    </div>
  );
}
