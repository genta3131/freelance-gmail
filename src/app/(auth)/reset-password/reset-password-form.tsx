"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tukar kode dari email link menjadi session (PKCE flow)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelled) {
          if (exchangeError) {
            setError(
              "Link reset tidak valid atau sudah kedaluwarsa. Mohon minta link baru.",
            );
          } else {
            setVerified(true);
          }
        }
      } else if (!cancelled) {
        // Cek apakah user sudah punya session aktif
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setVerified(!!session);
        if (!session) {
          setError("Session tidak ditemukan. Mohon minta link reset baru.");
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordInput) => {
    setLoading(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password: values.password,
    });

    setLoading(false);

    if (updateError) {
      toast.error("Gagal mengubah password", { description: updateError.message });
      return;
    }

    toast.success("Password berhasil diubah", {
      description: "Silakan login dengan password baru Anda.",
    });
    router.replace("/login");
  };

  if (error) {
    return (
      <div className="space-y-4 text-center">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">Link tidak valid</h1>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
        <Button asChild className="w-full">
          <Link href="/forgot-password">Minta link baru</Link>
        </Button>
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Memverifikasi link...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">Password baru</h1>
        <p className="text-xs text-muted-foreground">Buat password baru untuk akun Anda</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password baru</Label>
        <Input
          id="password"
          type="password"
          placeholder="Minimal 8 karakter, huruf + angka"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Konfirmasi password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Ulangi password baru"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-danger">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <ShieldCheck aria-hidden />
        )}
        Simpan password baru
      </Button>
    </form>
  );
}
