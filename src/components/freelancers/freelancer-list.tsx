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
import { Search, Mail, Phone, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Freelancer } from "@/types/database";

export function FreelancerList({ freelancers }: { freelancers: Freelancer[] }) {
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
    router.push(`/freelancers?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    router.push(`/freelancers?${params.toString()}`);
  };

  const currentStatus = searchParams.get("status") ?? "all";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari nama atau email..."
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
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </Card>

      {/* Freelancer List */}
      {freelancers.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-muted-foreground">Tidak ada freelancer ditemukan</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/freelancers/new">Tambah Freelancer Pertama</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {freelancers.map((freelancer) => (
            <Link key={freelancer.id} href={`/freelancers/${freelancer.id}`}>
              <Card className="p-4 transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-base font-semibold text-foreground">
                        {freelancer.name}
                      </h3>
                      {freelancer.status === "active" ? (
                        <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="size-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    {freelancer.email && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="size-3" />
                        <span className="truncate">{freelancer.email}</span>
                      </div>
                    )}
                    {freelancer.phone && (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="size-3" />
                        {freelancer.phone}
                      </div>
                    )}
                    {freelancer.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {freelancer.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {freelancer.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{freelancer.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
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
