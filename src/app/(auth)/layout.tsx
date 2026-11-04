import { LayoutGrid } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand text-white">
          <LayoutGrid className="size-4.5" aria-hidden />
        </span>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          WorkFlow Hub
        </span>
      </div>
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
        {children}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Manajemen freelance dalam satu tempat
      </p>
    </div>
  );
}
