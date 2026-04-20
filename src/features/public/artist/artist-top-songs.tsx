import Link from "next/link";
import type { ArtistSong } from "@/lib/api/public";
import { toTitleCase, formatNumber } from "@/shared/utils/format";

export function ArtistTopSongs({ songs }: { songs: ArtistSong[] }) {
  if (!songs.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Top Songs
      </h2>
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {songs.map((song, i) => (
          <Link
            key={song.id}
            href={song.slug ? `/songs/${song.slug}` : "#"}
            className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
          >
            <span className="w-5 shrink-0 text-xs font-mono text-muted-foreground text-right">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                {toTitleCase(song.title)}
              </p>
              {song.releaseDate && (
                <p className="text-xs text-muted-foreground">
                  {new Date(song.releaseDate).getFullYear()}
                </p>
              )}
            </div>
            <div className="text-right shrink-0">
              {song.totalStreams && (
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {formatNumber(Number(song.totalStreams))}
                </p>
              )}
              {song.dailyStreams && (
                <p className="text-xs text-muted-foreground">
                  {formatNumber(Number(song.dailyStreams))} today
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
