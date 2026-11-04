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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { logActivity } from "@/lib/activity";
import type { Freelancer } from "@/types/database";

const freelancerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional(),
  skills: z.string().optional(),
  hourly_rate: z.string().optional(),
  status: z.enum(["active", "inactive"]),
});

type FreelancerFormData = z.infer<typeof freelancerSchema>;

export function FreelancerForm({ freelancer }: { freelancer?: Freelancer }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FreelancerFormData>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: {
      name: freelancer?.name ?? "",
      email: freelancer?.email ?? "",
      phone: freelancer?.phone ?? "",
      skills: freelancer?.skills.join(", ") ?? "",
      hourly_rate: freelancer?.hourly_rate?.toString() ?? "",
      status: freelancer?.status ?? "active",
    },
  });

  const onSubmit = async (data: FreelancerFormData) => {
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const skillsArray = data.skills
        ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        skills: skillsArray,
        hourly_rate: data.hourly_rate ? parseFloat(data.hourly_rate) : null,
        status: data.status,
        created_by: user.id,
      };

      if (freelancer) {
        // Update
        const { error } = await supabase
          .from("freelancers")
          .update(payload)
          .eq("id", freelancer.id);
        if (error) throw error;
        await logActivity(user.id, "freelancer_updated", "freelancer", freelancer.id);
        toast.success("Freelancer berhasil diupdate");
      } else {
        // Create
        const { data: newFreelancer, error } = await supabase
          .from("freelancers")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        await logActivity(user.id, "freelancer_created", "freelancer", newFreelancer.id);
        toast.success("Freelancer berhasil ditambahkan");
      }

      router.push("/freelancers");
      router.refresh();
    } catch (error: any) {
      toast.error("Gagal menyimpan freelancer", { description: error.message });
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
            <Input id="name" {...register("name")} placeholder="Nama freelancer" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
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
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              {...register("skills")}
              placeholder="React, Node.js, TypeScript (pisahkan dengan koma)"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Pisahkan skills dengan koma (,)
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (IDR)</Label>
              <Input
                id="hourly_rate"
                type="number"
                {...register("hourly_rate")}
                placeholder="150000"
              />
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={watch("status")} onValueChange={(v: any) => setValue("status", v)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : freelancer ? "Update Freelancer" : "Tambah Freelancer"}
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
