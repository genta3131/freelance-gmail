import { Badge } from "@/components/ui/badge";
import {
  TASK_STATUSES,
  TASK_PRIORITIES,
  SUBMISSION_STATUSES,
} from "@/lib/constants";
import type { TaskStatus, TaskPriority, SubmissionStatus } from "@/types/database";
import { cn } from "@/lib/utils";

export function TaskStatusBadge({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  const s = TASK_STATUSES.find((x) => x.value === status);
  return (
    <Badge color={s?.color ?? "neutral"} className={cn("capitalize", className)}>
      {s?.label ?? status}
    </Badge>
  );
}

export function TaskPriorityBadge({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  const p = TASK_PRIORITIES.find((x) => x.value === priority);
  const color =
    priority === "urgent" ? "danger" : priority === "high" ? "warn" : priority === "medium" ? "info" : "neutral";
  return (
    <Badge color={color} className={className}>
      <span
        className={cn(
          "size-1.5 rounded-full bg-current",
        )}
        aria-hidden
      />
      {p?.label ?? priority}
    </Badge>
  );
}

export function SubmissionStatusBadge({
  status,
  className,
}: {
  status: SubmissionStatus;
  className?: string;
}) {
  const s = SUBMISSION_STATUSES.find((x) => x.value === status);
  return (
    <Badge color={s?.color ?? "neutral"} className={className}>
      {s?.label ?? status}
    </Badge>
  );
}
