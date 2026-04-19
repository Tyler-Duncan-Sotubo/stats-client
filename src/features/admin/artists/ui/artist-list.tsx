"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useArtists } from "../hooks/use-artists";
import { ArtistFilters } from "./artist-filters";
import { ArtistTable } from "./artist-table";

export function ArtistList() {
  const { data, loading, error, query, updateQuery, setPage } = useArtists();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Artists</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.meta.total.toLocaleString() ?? "—"} total artists
          </p>
        </div>
        <Link href="/admin/artists/new">
          <Button size="sm" className="gap-1.5">
            <Plus size={15} /> Add artist
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ArtistFilters query={query} onUpdate={updateQuery} />

      {/* Table */}
      <ArtistTable
        artists={data?.data ?? []}
        meta={data?.meta ?? { total: 0, page: 1, limit: 20, totalPages: 1 }}
        loading={loading}
        error={error}
        onPage={setPage}
      />
    </div>
  );
}
