"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          password: formData.get("password"),
          role: formData.get("role"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        toast.error("Gagal menambahkan user", { description: result.error ?? "Terjadi kesalahan." });
        return;
      }
      toast.success("User berhasil ditambahkan", { description: "User bisa langsung login dengan email dan password." });
      form.reset();
      router.refresh();
    } catch {
      toast.error("Tidak bisa menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Nama lengkap</Label>
          <Input id="fullName" name="fullName" required minLength={2} maxLength={100} autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email atau username login</Label>
          <Input id="email" name="email" type="text" required autoComplete="off" placeholder="contoh@akun.local atau nama@domain.com" />
          <p className="text-xs text-muted-foreground">Alamat email asli tidak wajib. Untuk username, gunakan format email seperti nama@akun.local.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password awal</Label>
          <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
          <p className="text-xs text-muted-foreground">Minimal 8 karakter, harus mengandung huruf dan angka.</p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">Role</Label>
          <select id="role" name="role" defaultValue="freelancer" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30">
            <option value="freelancer">Freelancer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" aria-hidden /> : <UserPlus aria-hidden />}
          Tambah user
        </Button>
      </form>
    </Card>
  );
}
