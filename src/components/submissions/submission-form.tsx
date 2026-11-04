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

const submissionSchema = z.object({
  notes: z.string().min(10, "Catatan minimal 10 karakter"),
  file_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

export function SubmissionForm({ taskId, freelancerId }: { taskId: string; freelancerId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  });

  const onSubmit = async (data: SubmissionFormData) => {
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const payload = {
        task_id: taskId,
        freelancer_id: freelancerId,
        notes: data.notes,
        file_url: data.file_url || null,
        status: "pending" as const,
      };

      const { data: newSubmission, error } = await supabase
        .from("submissions")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      await logActivity(user.id, "submission_created", "submission", newSubmission.id);
      toast.success("Submission berhasil dikirim");
      router.push(`/tasks/${taskId}`);
      router.refresh();
    } catch (error: any) {
      toast.error("Gagal mengirim submission", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Catatan *</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Jelaskan hasil pekerjaan Anda..."
              rows={6}
            />
            {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
            <p className="mt-1 text-xs text-muted-foreground">Minimal 10 karakter</p>
          </div>

          <div>
            <Label htmlFor="file_url">URL File</Label>
            <Input
              id="file_url"
              {...register("file_url")}
              placeholder="https://drive.google.com/file/..."
            />
            {errors.file_url && (
              <p className="mt-1 text-xs text-red-500">{errors.file_url.message}</p>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              Link ke Google Drive, Dropbox, atau hosting lainnya (opsional)
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Submission"}
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
