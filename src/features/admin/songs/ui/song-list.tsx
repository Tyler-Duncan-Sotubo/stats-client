"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useSongs } from "../hooks/use-songs";
import { SongFilters } from "./song-filters";
import { SongTable } from "./song-table";

export function SongList() {
  const { data, loading, error, query, updateQuery, setPage } = useSongs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Songs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.meta.total.toLocaleString() ?? "—"} total songs
          </p>
        </div>
        <Link href="/admin/songs/new">
          <Button size="sm" className="gap-1.5">
            <Plus size={15} /> Add song
          </Button>
        </Link>
      </div>

      <SongFilters query={query} onUpdate={updateQuery} />

      <SongTable
        songs={data?.data ?? []}
        meta={data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 }}
        loading={loading}
        error={error}
        onPage={setPage}
      />
    </div>
  );
}
