"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MailCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast.error("Gagal mengirim email", { description: error.message });
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
          <MailCheck className="size-5 text-brand" aria-hidden />
        </span>
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">Cek email Anda</h1>
          <p className="text-xs text-muted-foreground">
            Link reset password sudah dikirim ke{" "}
            <span className="text-foreground font-medium">{getValues("email")}</span>
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Kembali ke login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">Lupa password</h1>
        <p className="text-xs text-muted-foreground">
          Masukkan email Anda, kami kirim link reset password
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        Kirim link reset
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/login" className="text-brand hover:underline">
          Kembali ke login
        </Link>
      </p>
    </form>
  );
}
