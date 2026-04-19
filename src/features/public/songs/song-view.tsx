import Link from "next/link";
import Image from "next/image";
import type { PublicSong } from "@/lib/api/public";
import { SongStatRow } from "./song-stat-row";
import { SongCharts } from "./song-charts";
import { SongFeatures } from "./song-features";
import { ChevronLeft } from "lucide-react";
import { toTitleCase } from "@/shared/utils/format";

export function SongView({ song }: { song: PublicSong }) {
  const img = song.imageUrl ?? song.artistImageUrl;

  return (
    <div className="pb-16 max-w-5xl">
      {/* Back */}
      <Link
        href={song.artistSlug ? `/artists/${song.artistSlug}` : "/"}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {song.artistName ? toTitleCase(song.artistName) : "Back"}
      </Link>

      {/* Hero */}
      <div className="flex items-center gap-6 mb-8">
        {/* Artwork */}
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border shadow-lg">
          {img ? (
            <Image
              src={img}
              alt={song.title}
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/20">
                {song.title[0]}
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight mb-1">
            {toTitleCase(song.title)}
          </h1>

          <Link
            href={song.artistSlug ? `/artists/${song.artistSlug}` : "#"}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {song.artistName ? toTitleCase(song.artistName) : "—"}
          </Link>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {song.releaseDate && (
              <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                {new Date(song.releaseDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            )}
            {song.isAfrobeats && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Afrobeats
              </span>
            )}
            {song.explicit && (
              <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                Explicit
              </span>
            )}
            {song.spotifyTrackId && (
              <a
                href={`https://open.spotify.com/track/${song.spotifyTrackId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-3 py-1 text-xs font-semibold text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
              >
                Open in Spotify
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stat row */}
      <SongStatRow song={song} />

      {/* Content */}
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_280px]">
        {/* Left */}
        <div className="flex flex-col gap-8">
          <SongCharts charts={song.charts} />
        </div>

        {/* Right */}
        <div className="flex flex-col gap-6">
          <SongFeatures features={song.features} />
        </div>
      </div>
    </div>
  );
}
