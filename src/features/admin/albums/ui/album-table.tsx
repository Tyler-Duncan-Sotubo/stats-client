"use client";

import { useRouter } from "next/navigation";
import { DataTable } from "@/shared/ui/data-table";
import { albumColumns } from "./album-columns";
import type { Album, AlbumMeta } from "../types/album.types";

interface AlbumTableProps {
  albums: Album[];
  meta: AlbumMeta;
  loading: boolean;
  error: string | null;
  onPage: (page: number) => void;
}

export function AlbumTable({
  albums,
  meta,
  loading,
  error,
  onPage,
}: AlbumTableProps) {
  const router = useRouter();

  return (
    <DataTable
      columns={albumColumns}
      data={albums}
      loading={loading}
      error={error}
      meta={meta}
      onPage={onPage}
      selectable
      columnToggle
      emptyMessage="No albums found"
      onRowClick={(album) => router.push(`/admin/albums/${album.id}`)}
    />
  );
}
