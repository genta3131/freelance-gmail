import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground border-transparent",
        brand: "bg-brand/10 text-brand border-brand/20",
        success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        destructive: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        warning: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
        info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
