import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/shell/sidebar";
import { UserMenu, ThemeToggle } from "@/components/shell/user-menu";
import type { Profile } from "@/types/database";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let profile: Profile | null = null;
  {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data as Profile | null;
  }

  // Fallback jika profile belum ada (trigger signup gagal)
  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex min-h-dvh flex-1 bg-background">
      <Sidebar isAdmin={isAdmin} profile={profile} actions={<ThemeToggle />} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
