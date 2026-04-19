"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useAlbums } from "../hooks/use-albums";
import { AlbumFilters } from "./album-filters";
import { AlbumTable } from "./album-table";

export function AlbumList() {
  const { data, loading, error, query, updateQuery, setPage } = useAlbums();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Albums</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.meta.total.toLocaleString() ?? "—"} total albums
          </p>
        </div>
        <Link href="/admin/albums/new">
          <Button size="sm" className="gap-1.5">
            <Plus size={15} /> Add album
          </Button>
        </Link>
      </div>

      <AlbumFilters query={query} onUpdate={updateQuery} />

      <AlbumTable
        albums={data?.data ?? []}
        meta={data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 }}
        loading={loading}
        error={error}
        onPage={setPage}
      />
    </div>
  );
}
