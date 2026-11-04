"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

const profileSchema = z.object({
  full_name: z.string().min(1, "Nama tidak boleh kosong").max(100),
  avatar_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Password saat ini wajib diisi"),
    new_password: z.string().min(6, "Password minimal 6 karakter"),
    confirm_password: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export function SettingsForm({ profile, user }: { profile: Profile | null; user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      avatar_url: profile?.avatar_url ?? "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          avatar_url: data.avatar_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profil berhasil diupdate");
      router.refresh();
    } catch (error: any) {
      toast.error("Gagal update profil", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password,
      });

      if (error) throw error;

      toast.success("Password berhasil diubah");
      resetPassword();
    } catch (error: any) {
      toast.error("Gagal ubah password", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList>
        <TabsTrigger value="profile">Profil</TabsTrigger>
        <TabsTrigger value="security">Keamanan</TabsTrigger>
        <TabsTrigger value="account">Akun</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                  id="full_name"
                  {...registerProfile("full_name")}
                  placeholder="Nama lengkap Anda"
                />
                {profileErrors.full_name && (
                  <p className="mt-1 text-xs text-red-500">{profileErrors.full_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  {...registerProfile("avatar_url")}
                  placeholder="https://example.com/avatar.jpg"
                />
                {profileErrors.avatar_url && (
                  <p className="mt-1 text-xs text-red-500">{profileErrors.avatar_url.message}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  URL gambar avatar Anda (opsional)
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </Card>
        </form>
      </TabsContent>

      <TabsContent value="security">
        <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="current_password">Password Saat Ini</Label>
                <Input
                  id="current_password"
                  type="password"
                  {...registerPassword("current_password")}
                  placeholder="••••••••"
                />
                {passwordErrors.current_password && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.current_password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="new_password">Password Baru</Label>
                <Input
                  id="new_password"
                  type="password"
                  {...registerPassword("new_password")}
                  placeholder="••••••••"
                />
                {passwordErrors.new_password && (
                  <p className="mt-1 text-xs text-red-500">{passwordErrors.new_password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
                <Input
                  id="confirm_password"
                  type="password"
                  {...registerPassword("confirm_password")}
                  placeholder="••••••••"
                />
                {passwordErrors.confirm_password && (
                  <p className="mt-1 text-xs text-red-500">
                    {passwordErrors.confirm_password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit" disabled={loading}>
                {loading ? "Mengubah..." : "Ubah Password"}
              </Button>
            </div>
          </Card>
        </form>
      </TabsContent>

      <TabsContent value="account">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <p className="mt-1 text-sm text-foreground">{user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">Email tidak dapat diubah</p>
            </div>

            <Separator />

            <div>
              <Label>Role</Label>
              <p className="mt-1 text-sm text-foreground">
                {profile?.role === "admin" ? "Administrator" : "Freelancer"}
              </p>
            </div>

            <Separator />

            <div>
              <Label>Akun Dibuat</Label>
              <p className="mt-1 text-sm text-foreground">
                {new Date(user.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
