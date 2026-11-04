"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/constants";
import { logActivity } from "@/lib/activity";
import type { Client, Freelancer, Task } from "@/types/database";

const taskSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(200),
  description: z.string().optional(),
  client_id: z.string().optional(),
  freelancer_id: z.string().optional(),
  status: z.enum(["pending", "in_progress", "review", "completed", "rejected"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  due_date: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskForm({
  task,
  clients,
  freelancers,
}: {
  task?: Task;
  clients: Client[];
  freelancers: Freelancer[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      client_id: task?.client_id ?? undefined,
      freelancer_id: task?.freelancer_id ?? undefined,
      status: task?.status ?? "pending",
      priority: task?.priority ?? "medium",
      due_date: task?.due_date ? task.due_date.split("T")[0] : "",
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const payload = {
        ...data,
        client_id: data.client_id || null,
        freelancer_id: data.freelancer_id || null,
        due_date: data.due_date || null,
        created_by: user.id,
      };

      if (task) {
        // Update
        const { error } = await supabase.from("tasks").update(payload).eq("id", task.id);
        if (error) throw error;
        await logActivity(user.id, "task_updated", "task", task.id);
        toast.success("Task berhasil diupdate");
      } else {
        // Create
        const { data: newTask, error } = await supabase
          .from("tasks")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        await logActivity(user.id, "task_created", "task", newTask.id);
        toast.success("Task berhasil dibuat");
      }

      router.push("/tasks");
      router.refresh();
    } catch (error: any) {
      toast.error("Gagal menyimpan task", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Task *</Label>
            <Input id="title" {...register("title")} placeholder="Masukkan judul task" />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Deskripsi detail task"
              rows={4}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={watch("status")} onValueChange={(v: any) => setValue("status", v)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioritas *</Label>
              <Select
                value={watch("priority")}
                onValueChange={(v: any) => setValue("priority", v)}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="client_id">Client</Label>
              <Select
                value={watch("client_id") ?? "none"}
                onValueChange={(v) => setValue("client_id", v === "none" ? undefined : v)}
              >
                <SelectTrigger id="client_id">
                  <SelectValue placeholder="Pilih client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="freelancer_id">Freelancer</Label>
              <Select
                value={watch("freelancer_id") ?? "none"}
                onValueChange={(v) => setValue("freelancer_id", v === "none" ? undefined : v)}
              >
                <SelectTrigger id="freelancer_id">
                  <SelectValue placeholder="Pilih freelancer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tidak ada</SelectItem>
                  {freelancers.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="due_date">Deadline</Label>
            <Input id="due_date" type="date" {...register("due_date")} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : task ? "Update Task" : "Buat Task"}
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
