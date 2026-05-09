"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Disc3 } from "lucide-react";
import type { PublicAlbum } from "@/lib/api/public";
import { AlbumCard } from "./album-card";
import { AlbumsFilters } from "./albums-filters";
import { AlbumsPagination } from "./albums-pagination";

interface AlbumsViewProps {
  albums: PublicAlbum[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  currentSort: string;
  currentAlbumType?: string;
}

export function AlbumsView({
  albums,
  meta,
  currentSort,
  currentAlbumType,
}: AlbumsViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between md:items-center gap-4 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Albums
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta.total.toLocaleString()} albums
          </p>
        </div>
        <AlbumsFilters
          currentSort={currentSort}
          currentAlbumType={currentAlbumType}
        />
      </div>

      {/* Grid */}
      {albums.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Disc3 className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No albums found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} sortBy={currentSort} />
          ))}
        </div>
      )}

      <AlbumsPagination
        page={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
        limit={meta.limit}
        onPage={goToPage}
      />
    </div>
  );
}
