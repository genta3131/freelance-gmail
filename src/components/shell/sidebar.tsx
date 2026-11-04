"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  SquareCheckBig,
  UsersRound,
  Building2,
  FileCheck2,
  ChartColumn,
  History,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/shell/user-menu";
import type { Profile } from "@/types/database";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid, adminOnly: false },
  { href: "/tasks", label: "Task", icon: SquareCheckBig, adminOnly: false },
  { href: "/freelancers", label: "Freelancer", icon: UsersRound, adminOnly: true },
  { href: "/clients", label: "Client", icon: Building2, adminOnly: true },
  { href: "/submissions", label: "Submission", icon: FileCheck2, adminOnly: false },
  { href: "/analytics", label: "Analytics", icon: ChartColumn, adminOnly: false },
  { href: "/activity", label: "Aktivitas", icon: History, adminOnly: false },
  { href: "/settings", label: "Pengaturan", icon: Settings, adminOnly: false },
];

export function Sidebar({
  isAdmin,
  profile,
  actions,
}: {
  isAdmin: boolean;
  profile?: Profile | null;
  actions?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const items = NAV_ITEMS.filter((i) => !i.adminOnly || isAdmin);

  const navLinks = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-brand/10 font-medium text-brand"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile topbar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-white">
            <LayoutGrid className="size-3.5" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight">WorkFlow Hub</span>
        </div>
        <div className="flex items-center gap-1">
          {actions}
          {profile && <UserMenu profile={profile} />}
          <button
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      {open && (
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Navigasi utama"
          className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-y-auto border-r border-border bg-card lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
                <LayoutGrid className="size-4" aria-hidden />
              </span>
              WorkFlow Hub
            </span>
            <button
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          {navLinks}
        </aside>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-card lg:flex">
        <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white">
            <LayoutGrid className="size-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            WorkFlow Hub
          </span>
        </div>
        {navLinks}
        <div className="mt-auto flex items-center gap-2 border-t border-border p-4">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-xs text-muted-foreground">
              {profile?.full_name ?? "Pengguna"}
            </span>
            {profile && <UserMenu profile={profile} />}
          </div>
          {actions}
        </div>
      </aside>
    </>
  );
}
