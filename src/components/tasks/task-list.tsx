"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, User, Building2 } from "lucide-react";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/database";

export function TaskList({ tasks, isAdmin }: { tasks: Task[]; isAdmin: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/tasks?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    router.push(`/tasks?${params.toString()}`);
  };

  const currentStatus = searchParams.get("status") ?? "all";
  const currentPriority = searchParams.get("priority") ?? "all";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari task..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={currentStatus} onValueChange={(v) => handleFilter("status", v)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {TASK_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currentPriority} onValueChange={(v) => handleFilter("priority", v)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Prioritas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Prioritas</SelectItem>
              {TASK_PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
      </Card>

      {/* Task List */}
      {tasks.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">Tidak ada task ditemukan</p>
          {isAdmin && (
            <Button asChild className="mt-4" variant="outline">
              <Link href="/tasks/new">Buat Task Pertama</Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => {
            const statusInfo = TASK_STATUSES.find((s) => s.value === task.status);
            const priorityInfo = TASK_PRIORITIES.find((p) => p.value === task.priority);
            return (
              <Link key={task.id} href={`/tasks/${task.id}`}>
                <Card className="p-4 transition-shadow hover:shadow-md">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="flex-1 text-base font-semibold text-foreground">
                          {task.title}
                        </h3>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            statusInfo?.value === "completed" &&
                              "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                            statusInfo?.value === "in_progress" &&
                              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                            statusInfo?.value === "pending" &&
                              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                            statusInfo?.value === "review" &&
                              "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                            statusInfo?.value === "rejected" &&
                              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                          )}
                        >
                          {statusInfo?.label}
                        </span>
                      </div>
                      {task.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {task.priority && (
                          <span className="flex items-center gap-1">
                            <span
                              className={cn(
                                "size-2 rounded-full",
                                task.priority === "urgent" && "bg-red-500",
                                task.priority === "high" && "bg-orange-500",
                                task.priority === "medium" && "bg-yellow-500",
                                task.priority === "low" && "bg-green-500",
                              )}
                            />
                            {priorityInfo?.label}
                          </span>
                        )}
                        {task.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" aria-hidden />
                            {new Date(task.due_date).toLocaleDateString("id-ID")}
                          </span>
                        )}
                        {task.freelancer && (
                          <span className="flex items-center gap-1">
                            <User className="size-3" aria-hidden />
                            {task.freelancer.name}
                          </span>
                        )}
                        {task.client && (
                          <span className="flex items-center gap-1">
                            <Building2 className="size-3" aria-hidden />
                            {task.client.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
