import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const colorClass = {
  brand: "text-brand",
  info: "text-info",
  warn: "text-amber-500 dark:text-amber-400",
  danger: "text-danger",
  success: "text-emerald-500",
  neutral: "text-muted-foreground",
} as const;

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null;
  color?: keyof typeof colorClass;
  href?: string;
}

export function StatCard({ icon: Icon, label, value, color = "brand", href }: StatCardProps) {
  const body = (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 sm:p-5 transition-colors hover:bg-accent/40">
      <div className="min-w-0 space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-semibold tracking-tight text-card-foreground">
          {value ?? "—"}
        </p>
      </div>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-accent",
          colorClass[color],
        )}
      >
        <Icon className="size-4" aria-hidden />
      </span>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-xl">
        {body}
      </a>
    );
  }
  return body;
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
        <Skeleton className="size-9 rounded-lg" />
      </div>
    </div>
  );
}
