import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/shell/sidebar";
import { UserMenu, ThemeToggle } from "@/components/shell/user-menu";
import type { Profile } from "@/types/database";

function resolveProfile(user: { id: string; email?: string | null | undefined; app_metadata?: Record<string, unknown> }): Profile {
  const fullName =
    typeof user.app_metadata?.full_name === "string" ? (user.app_metadata.full_name as string) : undefined;
  return {
    id: user.id,
    role: "freelancer",
    full_name: fullName ?? (user.email?.split("@")[0] ?? "Pengguna"),
    avatar_url: null,
    theme: "system",
    notification_email: true,
    notification_submission: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export const instant = false;

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

  // Safety net: if the DB signup trigger (handle_new_user) didn't create a
  // `profiles` row — or it was deleted — derive one from the authenticated
  // user so the sidebar (incl. the logout button) always renders.
  if (!profile) {
    profile = resolveProfile(user);
  }

  const isAdmin = profile.role === "admin";

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background lg:flex-row lg:pl-60">
      <Sidebar isAdmin={isAdmin} profile={profile} actions={<ThemeToggle />} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
