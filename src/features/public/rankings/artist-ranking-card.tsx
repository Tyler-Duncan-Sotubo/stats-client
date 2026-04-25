import Link from "next/link";
import Image from "next/image";
import { formatNumber } from "@/shared/utils/format";
import { FEATURED_LIMITS } from "@/lib/constants/rankings";
import type { PublicArtist } from "@/lib/api/public";

interface ArtistRankingCardProps {
  slug: string;
  artist: PublicArtist;
}

export function ArtistRankingCard({ slug, artist }: ArtistRankingCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 group/card">
      {/* Artist header */}
      <div className="relative px-4 py-4 border-b border-border bg-linear-to-r from-card to-primary/5">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-tl-xl" />

        <div className="flex items-center gap-3 pl-2">
          {artist.imageUrl ? (
            <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted ring-2 ring-primary/20">
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full shrink-0 bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
              <span className="text-base font-bold text-primary">
                {artist.name[0]}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Link
              href={`/artists/${slug}`}
              className="text-sm font-bold text-foreground hover:text-primary transition-colors truncate block"
            >
              {artist.name}
            </Link>
            {artist.totalStreams && (
              <p className="text-xs text-muted-foreground/50 mt-0.5">
                {formatNumber(Number(artist.totalStreams))} streams
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ranking links */}
      <div className="divide-y divide-border/50">
        {FEATURED_LIMITS.map((limit, i) => (
          <Link
            key={limit}
            href={`/rankings/top-${limit}-${slug}-songs-by-streams`}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-primary/5 transition-colors group/link"
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold tabular-nums w-5 ${
                  i === 0
                    ? "text-primary"
                    : i === 1
                      ? "text-primary/60"
                      : "text-primary/30"
                }`}
              >
                {limit}
              </span>
              <span className="text-sm text-foreground group-hover/link:text-primary transition-colors">
                Top {limit} songs
              </span>
            </div>
            <span className="text-xs text-muted-foreground/30 group-hover/link:text-primary transition-colors">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
