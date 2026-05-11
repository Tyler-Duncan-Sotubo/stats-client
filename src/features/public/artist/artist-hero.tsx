import Image from "next/image";
import type { PublicArtist } from "@/lib/api/public";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";
import { ShareButton } from "@/shared/ui/share-button";

export function ArtistHero({
  artist,
  tooxclusiveUrl,
}: {
  artist: PublicArtist;
  tooxclusiveUrl: string | null;
}) {
  const country = getCountryName(artist.originCountry);
  const change = Number(artist.dailyListenerChange ?? 0);
  const isUp = change > 0;

  return (
    <div className="mb-6">
      <div className="flex items-end gap-4">
        {/* Artist image */}
        <div className="relative h-20 w-20 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-border shadow-2xl">
          {artist.imageUrl ? (
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              sizes="(max-width: 640px) 80px, 128px"
              className="object-cover object-top"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-xl sm:text-4xl font-bold text-muted-foreground/30">
                {artist.name[0]}
              </span>
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          {/* Country */}
          {country && (
            <p className="text-xs font-medium text-muted-foreground mb-1 truncate">
              {country}
            </p>
          )}

          {/* Artist name */}
          <h1 className="text-xl sm:text-4xl font-bold tracking-tight text-foreground leading-none mb-2 truncate">
            {artist.name}
          </h1>

          {/* Listeners + daily change */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {artist.monthlyListeners && (
              <span className="text-xs sm:text-sm text-muted-foreground">
                {formatNumber(Number(artist.monthlyListeners))} listeners
              </span>
            )}
            {change !== 0 && (
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${
                  isUp ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isUp ? "+" : ""}
                {formatNumber(Math.abs(change))}
              </span>
            )}
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-2 flex-wrap">
            {artist.isAfrobeats && (
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary">
                Afrobeats
              </span>
            )}
            {tooxclusiveUrl && (
              <a
                href={tooxclusiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#1877F2]/30 bg-[#1877F2]/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors whitespace-nowrap"
              >
                View on Tooxclusive
              </a>
            )}
          </div>
        </div>
        <div className="hidden sm:block">
          <ShareButton
            title={`${artist.name} — TooXclusive Stats`}
            text={`${artist.name} has ${formatNumber(artist.totalStreams ?? 0)} streams on Spotify 📊`}
            url={`https://tooxclusive.com/stats/artists/${artist.slug}`}
          />
        </div>
      </div>

      {/* Share row — below on mobile, clean separation */}
      <div className="mt-4 sm:hidden justify-end flex">
        <ShareButton
          title={`${artist.name} — TooXclusive Stats`}
          text={`${artist.name} has ${formatNumber(artist.totalStreams ?? 0)} streams on Spotify 📊`}
          url={`https://tooxclusive.com/stats/artists/${artist.slug}`}
        />
      </div>
    </div>
  );
}
