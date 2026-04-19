import Image from "next/image";
import Link from "next/link";
import type { PublicArtist } from "@/lib/api/public";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";

interface FeaturedArtistCardProps {
  artist: PublicArtist;
}

function getKeyStats(artist: PublicArtist) {
  const stats: { label: string; value: string }[] = [];

  if (artist.totalStreams) {
    stats.push({
      label: "Total Streams",
      value: formatNumber(Number(artist.totalStreams)),
    });
  }

  if (artist.monthlyListeners) {
    stats.push({
      label: "Monthly Listeners",
      value: formatNumber(Number(artist.monthlyListeners)),
    });
  }

  const ukAfrobeats = artist.charts.find(
    (c) =>
      c.chartName === "official_afrobeats_chart" &&
      c.chartTerritory === "UK" &&
      c.role === "primary",
  );
  if (ukAfrobeats && Number(ukAfrobeats.weeksAtNumber1) > 0) {
    stats.push({
      label: "Weeks at UK #1",
      value: String(ukAfrobeats.weeksAtNumber1),
    });
  }

  const grammyWins = artist.awards.filter(
    (a) => a.awardBody === "Grammy" && a.result === "won",
  ).length;
  if (grammyWins > 0) {
    stats.push({ label: "Grammy Wins", value: String(grammyWins) });
  }

  const ukSingles = artist.charts.find(
    (c) =>
      c.chartName === "uk_official_singles" &&
      c.chartTerritory === "UK" &&
      c.role === "primary",
  );
  if (ukSingles && ukSingles.distinctSongsCharted) {
    stats.push({
      label: "UK Chart Entries",
      value: String(ukSingles.distinctSongsCharted),
    });
  }

  return stats;
}

export function FeaturedArtistCard({ artist }: FeaturedArtistCardProps) {
  const stats = getKeyStats(artist);
  const topSong = artist.topSongs[0];
  const grammyWins = artist.awards.filter(
    (a) => a.awardBody === "Grammy" && a.result === "won",
  ).length;
  const grammyNoms = artist.awards.filter(
    (a) => a.awardBody === "Grammy",
  ).length;
  const countryName = getCountryName(artist.originCountry);

  return (
    <Link href={`/artists/${artist.slug}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 group-hover:shadow-2xl group-hover:border-border/60">
        {/* ── Mobile layout ────────────────────────────────────────────────── */}
        <div className="flex sm:hidden items-center gap-4 p-4 border-b border-border">
          {/* Avatar */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
            {artist.imageUrl ? (
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                sizes="64px"
                className="object-cover object-top"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground/20">
                  {artist.name[0]}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground truncate">
              {artist.name}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
              {countryName && (
                <span className="text-xs text-muted-foreground">
                  {countryName}
                </span>
              )}
              {grammyNoms > 0 && (
                <>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="text-xs text-amber-500 font-medium">
                    {grammyNoms}× Grammy
                  </span>
                </>
              )}
            </div>
            {artist.dailyStreams && (
              <p className="text-xs text-muted-foreground mt-1">
                <span className="font-semibold text-foreground">
                  {formatNumber(Number(artist.dailyStreams))}
                </span>{" "}
                daily streams
              </p>
            )}
          </div>
        </div>

        {/* Mobile stats — 2 key stats only */}
        <div className="flex sm:hidden divide-x divide-border border-b border-border">
          {stats.slice(0, 2).map((stat) => (
            <div key={stat.label} className="flex-1 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">
                {stat.label}
              </p>
              <p className="text-xs font-bold text-foreground tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile top song */}
        {topSong && (
          <div className="flex sm:hidden items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 mb-0.5">
                Biggest Song
              </p>
              <p className="text-[10px] font-semibold text-foreground truncate">
                {toTitleCase(topSong.title)}
              </p>
            </div>
            {topSong.totalStreams && (
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {formatNumber(Number(topSong.totalStreams))}
              </span>
            )}
          </div>
        )}

        {/* ── Desktop layout (unchanged) ────────────────────────────────────── */}
        {/* Hero image */}
        <div className="relative hidden sm:block h-64 w-full shrink-0 overflow-hidden bg-muted">
          {artist.imageUrl ? (
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              sizes="(max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl font-bold text-muted-foreground/20">
                {artist.name[0]}
              </span>
            </div>
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

          {/* Name + meta */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-white leading-tight tracking-tight">
                  {artist.name}
                </p>
                <div className="mt-1 flex items-center gap-2 flex-wrap">
                  {countryName && (
                    <span className="text-xs text-white/60">{countryName}</span>
                  )}
                  {grammyNoms > 0 && (
                    <>
                      <span className="text-white/30">·</span>
                      <span className="text-xs text-amber-400/90 font-medium">
                        {grammyNoms}× Grammy nominated
                      </span>
                    </>
                  )}
                  {grammyWins === 0 && grammyNoms > 0 && (
                    <>
                      <span className="text-white/30">·</span>
                      <span className="text-xs text-white/60">
                        {grammyNoms}× Grammy nominated
                      </span>
                    </>
                  )}
                </div>
              </div>

              {artist.dailyStreams && (
                <div className="shrink-0 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1.5 flex items-center text-center gap-2">
                  <p className="text-xs font-bold text-white leading-none">
                    {formatNumber(Number(artist.dailyStreams))}
                  </p>
                  <p className="text-xs text-white/60 leading-none">
                    daily streams
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop stats grid */}
        <div className="hidden sm:grid grid-cols-2 gap-px bg-border">
          {stats.slice(0, 4).map((stat) => (
            <div key={stat.label} className="bg-card px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/50 mb-1.5">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-foreground tabular-nums leading-none">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop top song */}
        {topSong && (
          <div className="hidden sm:block mt-auto border-t border-border bg-muted/30 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground/50 mb-2">
              Biggest Song
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground truncate">
                {toTitleCase(topSong.title)}
              </p>
              {topSong.totalStreams && (
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {formatNumber(Number(topSong.totalStreams))}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
