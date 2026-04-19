import Image from "next/image";
import Link from "next/link";
import type { BrowseArtist } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";

// artist-card.tsx
export function ArtistCard({
  artist,
  sortBy = "totalStreams",
}: {
  artist: BrowseArtist;
  sortBy?: string;
}) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group flex flex-col items-center rounded-xl border border-border bg-card p-3 text-center hover:shadow-lg transition-all duration-200 hover:border-border/60 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative mb-4 h-20 w-20 sm:h-32 sm:w-32 overflow-hidden rounded-full bg-muted ring-2 ring-border/50 group-hover:ring-primary/20 transition-all duration-200">
        {artist.imageUrl ? (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            sizes="(max-width: 640px) 80px, 128px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-2xl sm:text-3xl font-bold text-muted-foreground/20">
              {artist.name[0]}
            </span>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-bold text-foreground leading-tight line-clamp-1 w-full mb-0.5">
        {artist.name}
      </p>

      {/* Country */}
      {artist.originCountry && (
        <p className="text-xs text-muted-foreground mb-2">
          {getCountryName(artist.originCountry)}
        </p>
      )}

      {/* Stat — switches based on sortBy */}
      {sortBy === "monthlyListeners" && artist.monthlyListeners ? (
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {formatNumber(artist.monthlyListeners)} listeners
        </p>
      ) : sortBy === "name" && artist.totalStreams ? (
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {formatNumber(artist.totalStreams)} streams
        </p>
      ) : artist.totalStreams ? (
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {formatNumber(artist.totalStreams)} streams
        </p>
      ) : artist.monthlyListeners ? (
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {formatNumber(artist.monthlyListeners)} listeners
        </p>
      ) : null}
    </Link>
  );
}
