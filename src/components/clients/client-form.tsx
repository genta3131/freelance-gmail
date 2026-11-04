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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { logActivity } from "@/lib/activity";
import type { Client } from "@/types/database";

const clientSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  company: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export function ClientForm({ client }: { client?: Client }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name ?? "",
      company: client?.company ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      notes: client?.notes ?? "",
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const payload = {
        name: data.name,
        company: data.company || null,
        email: data.email || null,
        phone: data.phone || null,
        notes: data.notes || null,
        created_by: user.id,
      };

      if (client) {
        // Update
        const { error } = await supabase.from("clients").update(payload).eq("id", client.id);
        if (error) throw error;
        await logActivity(user.id, "client_updated", "client", client.id);
        toast.success("Client berhasil diupdate");
      } else {
        // Create
        const { data: newClient, error } = await supabase
          .from("clients")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        await logActivity(user.id, "client_created", "client", newClient.id);
        toast.success("Client berhasil ditambahkan");
      }

      router.push("/clients");
      router.refresh();
    } catch (error: any) {
      toast.error("Gagal menyimpan client", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nama *</Label>
            <Input id="name" {...register("name")} placeholder="Nama client" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="company">Perusahaan</Label>
            <Input id="company" {...register("company")} placeholder="Nama perusahaan" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="email@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Telepon</Label>
              <Input id="phone" {...register("phone")} placeholder="+62 812 3456 7890" />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Catatan tambahan tentang client..."
              rows={4}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : client ? "Update Client" : "Tambah Client"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Batal
          </Button>
        </div>
      </Card>
    </form>
  );
}
