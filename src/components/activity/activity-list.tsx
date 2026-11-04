"use client";

import { Card } from "@/components/ui/card";
import { activityMessage } from "@/lib/constants";
import { Calendar, User } from "lucide-react";
import type { ActivityLog } from "@/types/database";

export function ActivityList({ activities }: { activities: ActivityLog[] }) {
  if (activities.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-sm text-muted-foreground">Belum ada aktivitas</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 border-b border-border pb-4 last:border-0 last:pb-0"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <User className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.user?.full_name ?? "Pengguna"}</span>{" "}
                {activityMessage(activity.action)}
              </p>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3" />
                {new Date(activity.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
