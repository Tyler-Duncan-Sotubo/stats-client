"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/shared/ui/data-table";
import { Button } from "@/shared/ui/button";
import { songColumns } from "./song-columns";
import type { Song, SongMeta } from "../types/song.types";

interface SongTableProps {
  songs: Song[];
  meta: SongMeta;
  loading: boolean;
  error: string | null;
  onPage: (page: number) => void;
}

export function SongTable({
  songs,
  meta,
  loading,
  error,
  onPage,
}: SongTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={songColumns}
      data={songs}
      loading={loading}
      error={error}
      meta={meta}
      onPage={onPage}
      selectable
      columnToggle
      searchable
      searchPlaceholder="Search songs..."
      searchColumn="title"
      emptyMessage="No songs found"
      onRowClick={(song) => router.push(`/admin/songs/${song.id}`)}
      bulkActions={(selected, clear) => (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log(
                "Set afrobeats",
                selected.map((s) => s.id),
              );
              clear();
            }}
          >
            Set Afrobeats
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log(
                "Mark reviewed",
                selected.map((s) => s.id),
              );
              clear();
            }}
          >
            Mark reviewed
          </Button>
        </>
      )}
    />
  );
}
