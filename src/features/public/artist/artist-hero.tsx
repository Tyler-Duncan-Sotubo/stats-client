import Image from "next/image";
import type { PublicArtist } from "@/lib/api/public";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";

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
    <div className="relative h-40 w-full overflow-hidden">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 flex items-end gap-6">
        {/* Artist image */}
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-border shadow-2xl">
          {artist.imageUrl ? (
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              sizes="128px"
              className="object-cover object-top"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-4xl font-bold text-muted-foreground/30">
                {artist.name[0]}
              </span>
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0 pb-1">
          {/* Country only on top */}
          {country && (
            <div className="mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                {country}
              </span>
            </div>
          )}

          {/* Artist name */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground leading-none mb-3">
            {artist.name}
          </h1>

          {/* Listeners + daily change */}
          <div className="flex items-center gap-3 flex-wrap mb-2">
            {artist.monthlyListeners && (
              <span className="text-sm text-muted-foreground">
                {formatNumber(Number(artist.monthlyListeners))} monthly
                listeners
              </span>
            )}
            {change !== 0 && (
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  isUp ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {isUp ? "+" : ""}
                {formatNumber(Math.abs(change))} today
              </span>
            )}
          </div>

          {/* Afrobeats + Tooxclusive — below metrics */}
          <div className="flex items-center gap-2 flex-wrap">
            {artist.isAfrobeats && (
              <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-widest text-primary">
                Afrobeats
              </span>
            )}
            {tooxclusiveUrl && (
              <a
                href={tooxclusiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#1877F2]/30 bg-[#1877F2]/10 px-3 py-1 text-xs font-semibold text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
              >
                View on Tooxclusive
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
