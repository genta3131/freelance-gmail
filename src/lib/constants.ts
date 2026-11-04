import type { TaskStatus, TaskPriority, SubmissionStatus, ActivityAction } from "@/types/database";

export const TASK_STATUSES: {
  value: TaskStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu", color: "warn" },
  { value: "in_progress", label: "Dikerjakan", color: "info" },
  { value: "review", label: "Review", color: "brand" },
  { value: "completed", label: "Selesai", color: "success" },
  { value: "rejected", label: "Ditolak", color: "danger" },
];

export const TASK_PRIORITIES: {
  value: TaskPriority;
  label: string;
  color: string;
}[] = [
  { value: "low", label: "Rendah" },
  { value: "medium", label: "Sedang" },
  { value: "high", label: "Tinggi" },
  { value: "urgent", label: "Urgent" },
];

export const SUBMISSION_STATUSES: {
  value: SubmissionStatus;
  label: string;
  color: string;
}[] = [
  { value: "pending", label: "Menunggu Review", color: "warn" },
  { value: "approved", label: "Disetujui", color: "success" },
  { value: "rejected", label: "Ditolak", color: "danger" },
];

export function taskStatusLabel(s: TaskStatus) {
  return TASK_STATUSES.find((x) => x.value === s)?.label ?? s;
}

export function taskPriorityLabel(p: TaskPriority) {
  return TASK_PRIORITIES.find((x) => x.value === p)?.label ?? p;
}

export function submissionStatusLabel(s: SubmissionStatus) {
  return SUBMISSION_STATUSES.find((x) => x.value === s)?.label ?? s;
}

export const ACTIVITY_MESSAGES: Record<ActivityAction, string> = {
  task_created: "membuat task",
  task_updated: "mengubah task",
  task_completed: "menyelesaikan task",
  task_deleted: "menghapus task",
  freelancer_assigned: "assign freelancer ke task",
  freelancer_created: "menambah freelancer",
  freelancer_updated: "mengubah freelancer",
  client_created: "menambah client",
  client_updated: "mengubah client",
  client_deleted: "menghapus client",
  submission_created: "mengirim submission",
  submission_approved: "menyetujui submission",
  submission_rejected: "menolak submission",
};

export function activityMessage(a: ActivityAction) {
  return ACTIVITY_MESSAGES[a] ?? a;
}

export const ZOD_MESSAGES = {
  required: "Wajib diisi",
  minTitle: "Judul minimal 3 karakter",
  maxTitle: "Judul maksimal 200 karakter",
  invalidEmail: "Format email tidak valid",
};
