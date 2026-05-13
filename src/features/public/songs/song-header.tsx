import Link from "next/link";
import Image from "next/image";
import type { PublicSong } from "@/lib/api/public";
import { ChevronLeft, ExternalLink, Play } from "lucide-react";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { ShareButton } from "@/shared/ui/share-button";

export function SongHeader({ song }: { song: PublicSong }) {
  const img = song.imageUrl ?? song.artistImageUrl;

  return (
    <>
      {/* Back */}
      <Link
        href={song.artistSlug ? `/artists/${song.artistSlug}` : "/"}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        {song.artistName ? toTitleCase(song.artistName) : "Back"}
      </Link>

      {/* Hero */}
      <div className="flex items-start gap-4 mb-8">
        {/* Artwork */}
        <div className="relative h-20 w-20 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-muted border border-border shadow-lg">
          {img ? (
            <Image
              src={img}
              alt={song.title}
              fill
              sizes="(max-width: 640px) 80px, 144px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-2xl sm:text-4xl font-bold text-muted-foreground/20">
                {song.title[0]}
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-3xl font-bold tracking-tight text-foreground leading-tight mb-1 line-clamp-2">
            {toTitleCase(song.title)}
          </h1>

          <Link
            href={song.artistSlug ? `/artists/${song.artistSlug}` : "#"}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate block"
          >
            {song.artistName ? toTitleCase(song.artistName) : "—"}
          </Link>

          {/* Featured artists */}
          {song.features.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground">feat.</span>
              {song.features.map((f) => (
                <Link
                  key={f.artistId}
                  href={f.artistSlug ? `/artists/${f.artistSlug}` : "#"}
                  className="flex items-center gap-1 text-xs font-medium hover:text-primary transition-colors"
                >
                  {f.artistImageUrl && (
                    <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={f.artistImageUrl}
                        alt={f.artistName ?? ""}
                        fill
                        sizes="16px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="truncate max-w-20 sm:max-w-none">
                    {f.artistName}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Tags */}
          <div className="mt-3 flex items-center justify-between ">
            <div className="flex items-center justify-between gap-1.5">
              {song.releaseDate && (
                <span className="rounded-full border border-border bg-muted/40 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {new Date(song.releaseDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {song.isAfrobeats && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-primary whitespace-nowrap">
                  Afrobeats
                </span>
              )}
              {song.explicit && (
                <span className="rounded-full border border-border bg-muted/40 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-muted-foreground">
                  E
                </span>
              )}
              {song.spotifyTrackId && (
                <a
                  href={`https://open.spotify.com/track/${song.spotifyTrackId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors whitespace-nowrap"
                >
                  Spotify
                </a>
              )}
              {song.tooxclusiveUrl && (
                <a
                  href={song.tooxclusiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-orange-500 hover:bg-orange-500/20 transition-colors whitespace-nowrap"
                >
                  <Play className="w-2.5 h-2.5 fill-orange-500" />
                  TooXclusive
                </a>
              )}
            </div>
            <div className="hidden sm:block">
              <ShareButton
                title={`${song.title} by ${song.artistName} — TooXclusive Stats`}
                text={`"${song.title}" by ${song.artistName} has ${formatNumber(song.totalStreams ?? 0)} streams on Spotify 📊`}
                url={`https://tooxclusive.com/stats/songs/${song.slug}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share — own row below hero on mobile */}
      <div className="mb-6 sm:hidden">
        <ShareButton
          title={`${song.title} by ${song.artistName} — TooXclusive Stats`}
          text={`"${song.title}" by ${song.artistName} has ${formatNumber(song.totalStreams ?? 0)} streams on Spotify 📊`}
          url={`https://tooxclusive.com/stats/songs/${song.slug}`}
        />
      </div>
    </>
  );
}
