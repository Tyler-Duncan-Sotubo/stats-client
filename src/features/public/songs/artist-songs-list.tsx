// features/public/songs/artist-songs-list.tsx
import Link from "next/link";
import Image from "next/image";
import type { ArtistSongEntry } from "@/lib/api/public";
import { formatNumber, toTitleCase } from "@/shared/utils/format";

interface Props {
  songs: ArtistSongEntry[];
  artistName: string | null;
  artistSlug: string | null;
}

export function ArtistSongsList({ songs, artistName, artistSlug }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          More by {artistName ? toTitleCase(artistName) : "this artist"}
        </p>
        {artistSlug && (
          <Link
            href={`/artists/${artistSlug}`}
            className="text-xs text-primary hover:underline"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {songs.slice(0, 8).map((s) => (
          <Link
            key={s.id}
            href={s.slug ? `/songs/${s.slug}` : "#"}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0">
              {s.imageUrl ? (
                <Image
                  src={s.imageUrl}
                  alt={s.title}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground/30">
                  {s.title[0]}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {toTitleCase(s.title)}
              </p>
              {s.totalStreams && (
                <p className="text-xs text-muted-foreground">
                  {formatNumber(Number(s.totalStreams))} streams
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
