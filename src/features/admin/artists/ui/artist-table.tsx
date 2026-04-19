"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/shared/ui/data-table";
import { Button } from "@/shared/ui/button";
import { artistColumns } from "./artist-columns";
import type { Artist, ArtistMeta } from "../types/artist.types";

interface ArtistTableProps {
  artists: Artist[];
  meta: ArtistMeta;
  loading: boolean;
  error: string | null;
  onPage: (page: number) => void;
}

export function ArtistTable({
  artists,
  meta,
  loading,
  error,
  onPage,
}: ArtistTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={artistColumns}
      data={artists}
      loading={loading}
      error={error}
      meta={meta}
      onPage={onPage}
      selectable
      columnToggle
      emptyMessage="No artists found"
      onRowClick={(artist) => router.push(`/admin/artists/${artist.id}`)}
      bulkActions={(selected, clear) => (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // wire to bulk update hook
              console.log(
                "Set country for",
                selected.map((a) => a.id),
              );
              clear();
            }}
          >
            Set country
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log(
                "Set afrobeats for",
                selected.map((a) => a.id),
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
                selected.map((a) => a.id),
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
