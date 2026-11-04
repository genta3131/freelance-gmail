"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, User, FileText } from "lucide-react";
import { SUBMISSION_STATUSES } from "@/lib/constants";
import type { Submission } from "@/types/database";

export function SubmissionList({
  submissions,
  isAdmin,
}: {
  submissions: Submission[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/submissions?${params.toString()}`);
  };

  const currentStatus = searchParams.get("status") ?? "all";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-3">
          <Select value={currentStatus} onValueChange={(v) => handleFilter("status", v)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {SUBMISSION_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Submission List */}
      {submissions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">Tidak ada submission ditemukan</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {submissions.map((submission) => (
            <Link key={submission.id} href={`/submissions/${submission.id}`}>
              <Card className="p-4 transition-shadow hover:shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="flex-1 text-base font-semibold text-foreground">
                        {submission.task?.title ?? "Unknown Task"}
                      </h3>
                      <Badge
                        variant={
                          submission.status === "approved"
                            ? "success"
                            : submission.status === "rejected"
                              ? "destructive"
                              : "default"
                        }
                      >
                        {SUBMISSION_STATUSES.find((s) => s.value === submission.status)?.label}
                      </Badge>
                    </div>
                    {submission.notes && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {submission.notes}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {submission.freelancer && (
                        <span className="flex items-center gap-1">
                          <User className="size-3" aria-hidden />
                          {submission.freelancer.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" aria-hidden />
                        {new Date(submission.created_at).toLocaleDateString("id-ID")}
                      </span>
                      {submission.file_url && (
                        <span className="flex items-center gap-1">
                          <FileText className="size-3" aria-hidden />
                          File tersedia
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
