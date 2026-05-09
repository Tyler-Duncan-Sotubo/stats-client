"use client";

import Link from "next/link";
import type { PublicAlbumTrack } from "@/lib/api/public";
import { formatNumber, toTitleCase } from "@/shared/utils/format";

export function AlbumTracklist({ tracks }: { tracks: PublicAlbumTrack[] }) {
  if (!tracks.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Tracklist
      </h2>
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
          >
            {/* Track number */}
            <span className="w-5 shrink-0 text-xs font-mono text-muted-foreground text-right">
              {track.trackNumber}
            </span>

            {/* Title + featured artists */}
            <div className="flex-1 min-w-0">
              {track.slug ? (
                <Link
                  href={`/songs/${track.slug}`}
                  className="text-sm font-medium text-foreground truncate hover:underline block"
                >
                  {toTitleCase(track.title)}
                  {track.explicit && (
                    <span className="ml-1.5 text-[10px] font-bold text-muted-foreground border border-muted-foreground/30 rounded px-1 py-0.5 align-middle">
                      E
                    </span>
                  )}
                </Link>
              ) : (
                <p className="text-sm font-medium text-foreground truncate">
                  {toTitleCase(track.title)}
                  {track.explicit && (
                    <span className="ml-1.5 text-[10px] font-bold text-muted-foreground border border-muted-foreground/30 rounded px-1 py-0.5 align-middle">
                      E
                    </span>
                  )}
                </p>
              )}
              {track.featuredArtists.length > 0 && (
                <p className="text-xs text-muted-foreground truncate">
                  feat.{" "}
                  {track.featuredArtists.map((a, i) => (
                    <span key={a.id}>
                      {a.slug ? (
                        <Link
                          href={`/artists/${a.slug}`}
                          className="hover:underline"
                        >
                          {a.name}
                        </Link>
                      ) : (
                        a.name
                      )}
                      {i < track.featuredArtists.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}
            </div>

            {/* Streams + duration */}
            <div className="text-right shrink-0">
              {track.totalStreams && (
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {formatNumber(Number(track.totalStreams))}
                </p>
              )}
              {track.durationMs && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  {Math.floor(track.durationMs / 60000)}:
                  {String(
                    Math.floor((track.durationMs % 60000) / 1000),
                  ).padStart(2, "0")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
