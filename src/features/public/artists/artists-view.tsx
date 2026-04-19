"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import type { BrowseArtist } from "@/lib/api/public";
import { AlphabetFilter } from "./alphabet-filter";
import { ArtistsFilters } from "./artists-filters";
import { ArtistCard } from "./artist-card";
import { ArtistsPagination } from "./artists-pagination";

interface ArtistsViewProps {
  artists: BrowseArtist[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  currentLetter?: string;
  currentCountry?: string;
  currentSort: string;
}

export function ArtistsView({
  artists,
  meta,
  currentLetter,
  currentCountry,
  currentSort,
}: ArtistsViewProps) {
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
      <div className="mb-12 flex flex-col justify-between md:items-center gap-4 md:flex-row">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Artists
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {meta.total.toLocaleString()} artists
          </p>
        </div>
        <ArtistsFilters
          currentSort={currentSort}
          currentCountry={currentCountry}
          currentLetter={currentLetter}
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 space-y-4">
        <AlphabetFilter currentLetter={currentLetter} />
      </div>

      {/* Grid */}
      {artists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">No artists found</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}

      <ArtistsPagination
        page={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
        limit={meta.limit}
        onPage={goToPage}
      />
    </div>
  );
}
