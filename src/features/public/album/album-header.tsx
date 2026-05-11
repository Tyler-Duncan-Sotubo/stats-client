import Image from "next/image";
import Link from "next/link";
import type { PublicAlbum, PublicAlbumTrack } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { Disc3 } from "lucide-react";
import { buildAlbumSummary } from "./utils/album-summary";
import { ShareButton } from "@/shared/ui/share-button";

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
      <div className="mb-6">
        <Link
          href={`/artists/${album.artistSlug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to {album.artistName}
        </Link>
      </div>

      {/* Album header — always side by side */}
      <div className="flex flex-row gap-4 sm:gap-6 mb-8 items-start">
        {/* Cover */}
        <div className="relative w-24 h-24 sm:w-48 sm:h-48 shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-muted ring-1 ring-border/50">
          {album.imageUrl ? (
            <Image
              src={album.imageUrl}
              alt={album.title}
              fill
              sizes="(max-width: 640px) 96px, 192px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Disc3 className="w-8 h-8 sm:w-16 sm:h-16 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2">
          {/* Top — title + desktop share */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                {album.albumType}
              </p>
              <h1 className="text-base sm:text-3xl font-bold tracking-tight text-foreground leading-tight line-clamp-2">
                {album.title}
              </h1>
            </div>
            {/* Share — desktop only */}
            <div className="hidden sm:block shrink-0 mt-1">
              <div className="hidden sm:block shrink-0 mt-1">
                <ShareButton
                  title={`${album.title} by ${album.artistName} — TooXclusive Stats`}
                  text={`${album.title} by ${album.artistName} has ${formatNumber(album.totalStreams ?? 0)} streams on Spotify 📊`}
                  url={`https://tooxclusive.com/stats/albums/${album.slug}`}
                />
              </div>
            </div>
          </div>

          {/* Artist */}
          <Link
            href={`/artists/${album.artistSlug}`}
            className="text-xs sm:text-base font-semibold text-muted-foreground hover:text-foreground transition-colors truncate block"
          >
            {album.artistName}
          </Link>

          {/* Release info */}
          <div className="flex items-center gap-2 text-[10px] sm:text-sm text-muted-foreground flex-wrap font-medium">
            {album.releaseDate && <span>{album.releaseDate.slice(0, 4)}</span>}
            {album.totalTracks && <span>{album.totalTracks} tracks</span>}
            {totalMinutes > 0 && <span>{totalMinutes} min</span>}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
            {album.totalStreams && (
              <div>
                <p className="text-sm sm:text-xl font-bold tabular-nums text-foreground">
                  {formatNumber(album.totalStreams)}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Total streams
                </p>
              </div>
            )}
            {album.dailyStreams && (
              <div>
                <p className="text-sm sm:text-xl font-bold tabular-nums text-foreground">
                  {formatNumber(album.dailyStreams)}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Daily streams
                </p>
              </div>
            )}
          </div>

          {/* Spotify */}
          <div>
            <a
              href={`https://open.spotify.com/album/${album.spotifyAlbumId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors inline-block"
            >
              Open in Spotify
            </a>
          </div>
        </div>
      </div>

      {/* Share — mobile only below header */}
      <div className="sm:hidden mb-6">
        <div className="sm:hidden mt-2">
          <ShareButton
            title={`${album.title} by ${album.artistName} — TooXclusive Stats`}
            text={`${album.title} by ${album.artistName} has ${formatNumber(album.totalStreams ?? 0)} streams on Spotify 📊`}
            url={`https://tooxclusive.com/stats/albums/${album.slug}`}
          />
        </div>
      </div>

      {/* SEO summary */}
      {(intro || highlights.length > 0) && (
        <div className="rounded-xl border border-border bg-card px-4 sm:px-5 py-3 sm:py-4 mb-8">
          <p className="text-xs sm:text-base text-muted-foreground leading-relaxed">
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
