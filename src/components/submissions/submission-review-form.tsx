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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { logActivity } from "@/lib/activity";

const reviewSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  feedback: z.string().min(1, "Feedback wajib diisi"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function SubmissionReviewForm({ submissionId }: { submissionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData, status: "approved" | "rejected") => {
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("submissions")
        .update({
          status,
          feedback: data.feedback,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      if (error) throw error;

      const action = status === "approved" ? "submission_approved" : "submission_rejected";
      await logActivity(user.id, action, "submission", submissionId);

      toast.success(
        status === "approved" ? "Submission disetujui" : "Submission ditolak"
      );
      router.push("/submissions");
      router.refresh();
    } catch (error: any) {
      toast.error("Gagal review submission", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-base font-semibold text-foreground">Review Submission</h2>
      <form className="space-y-4">
        <div>
          <Label htmlFor="feedback">Feedback *</Label>
          <Textarea
            id="feedback"
            {...register("feedback")}
            placeholder="Berikan feedback untuk submission ini..."
            rows={4}
          />
          {errors.feedback && (
            <p className="mt-1 text-xs text-red-500">{errors.feedback.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleSubmit((data) => onSubmit(data, "approved"))}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? "Memproses..." : "Setujui"}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSubmit((data) => onSubmit(data, "rejected"))}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Tolak"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
