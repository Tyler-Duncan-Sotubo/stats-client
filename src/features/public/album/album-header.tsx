import Image from "next/image";
import Link from "next/link";
import type { PublicAlbum, PublicAlbumTrack } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { Disc3 } from "lucide-react";
import { buildAlbumSummary } from "./utils/album-summary";

export function AlbumHeader({
  album,
  tracklist,
}: {
  album: PublicAlbum;
  tracklist: PublicAlbumTrack[];
}) {
  const totalDurationMs = tracklist.reduce(
    (acc, t) => acc + (t.durationMs ?? 0),
    0,
  );
  const totalMinutes = Math.floor(totalDurationMs / 60000);

  const { intro, highlights } = buildAlbumSummary(album, tracklist);

  return (
    <>
      {/* Back to artist */}
      <div className="mb-10">
        <Link
          href={`/artists/${album.artistSlug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to {album.artistName}
        </Link>
      </div>

      {/* Album header */}
      <div className="flex flex-col sm:flex-row gap-6 mb-10">
        {/* Cover */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 rounded-xl overflow-hidden bg-muted ring-1 ring-border/50 self-start">
          {album.imageUrl ? (
            <Image
              src={album.imageUrl}
              alt={album.title}
              fill
              sizes="192px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Disc3 className="w-16 h-16 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-col justify-end gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {album.albumType}
          </p>
          <section className="max-w-2xl flex gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {album.title}
            </h1>
            <div className="flex items-center gap-3 text-base text-muted-foreground flex-wrap mt-1 font-bold">
              {album.releaseDate && (
                <span>{album.releaseDate.slice(0, 4)}</span>
              )}
              {album.totalTracks && <span>{album.totalTracks} tracks</span>}
              {totalMinutes > 0 && <span>{totalMinutes} min</span>}
            </div>
          </section>
          <Link
            href={`/artists/${album.artistSlug}`}
            className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            {album.artistName}
          </Link>

          {/* Spotify link inline with stats */}
          <div>
            <a
              href={`https://open.spotify.com/album/${album.spotifyAlbumId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-3 py-1 text-xs font-semibold text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
            >
              Open in Spotify
            </a>
          </div>

          {/* Stats + Spotify in one row */}
          <div className="flex items-center gap-6 mt-2 flex-wrap">
            {album.totalStreams && (
              <div>
                <p className="text-xl font-bold tabular-nums text-foreground">
                  {formatNumber(album.totalStreams)}
                </p>
                <p className="text-xs text-muted-foreground">Total streams</p>
              </div>
            )}
            {album.dailyStreams && (
              <div>
                <p className="text-xl font-bold tabular-nums text-foreground">
                  {formatNumber(album.dailyStreams)}
                </p>
                <p className="text-xs text-muted-foreground">Daily streams</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO summary */}
      {(intro || highlights.length > 0) && (
        <div className="rounded-xl border border-border bg-card px-5 py-4 mb-8">
          <p className="text-base text-muted-foreground leading-relaxed">
            {intro}{" "}
            {highlights.map((h, i) => (
              <span key={i}>{h} </span>
            ))}
          </p>
        </div>
      )}
    </>
  );
}
