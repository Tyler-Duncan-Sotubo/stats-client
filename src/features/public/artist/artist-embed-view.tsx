// features/public/artist/artist-embed-view.tsx
import Image from "next/image";
import { formatNumber } from "@/shared/utils/format";
import { toTitleCase } from "@/shared/utils/format";
import type { PublicArtist } from "@/lib/api/public";
import { CHART_LABELS } from "@/lib/constants/charts";

interface Props {
  artist: PublicArtist | null;
}

const BASE_URL = "https://tooxclusive.com/stats";

export function ArtistEmbedView({ artist }: Props) {
  if (!artist) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        Artist not found
      </div>
    );
  }

  const topChart = artist.charts?.[0];
  const topSongs = artist.topSongs?.slice(0, 3) ?? [];

  return (
    <div className="flex flex-col">
      <p className="text-xl font-semibold px-4 py-2">
        See Stats From {artist.name}
      </p>
      {/* Hero */}
      <div className="relative h-20 w-full overflow-hidden bg-muted">
        {/* Artist info over hero */}
        <div className="absolute bottom-3 left-4 flex items-end gap-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 border-2 border-border shadow-lg">
            {artist.imageUrl ? (
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-lg font-bold text-muted-foreground/30">
                  {artist.name[0]}
                </span>
              </div>
            )}
          </div>
          <div className="pb-0.5">
            <p className="text-sm font-bold text-foreground leading-tight">
              {artist.name}
            </p>
            {artist.originCountry && (
              <p className="text-xs text-muted-foreground">
                {artist.originCountry}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {[
          {
            label: "Streams",
            value: artist.totalStreams
              ? formatNumber(Number(artist.totalStreams))
              : "—",
          },
          {
            label: "Listeners",
            value: artist.monthlyListeners
              ? formatNumber(Number(artist.monthlyListeners))
              : "—",
          },
          {
            label: "Daily",
            value: artist.dailyStreams
              ? formatNumber(Number(artist.dailyStreams))
              : "—",
          },
        ].map((stat) => (
          <div key={stat.label} className="px-3 py-2.5 text-center">
            <p className="text-xs text-muted-foreground/50 uppercase tracking-wide mb-0.5">
              {stat.label}
            </p>
            <p className="text-sm font-bold tabular-nums text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Top songs */}
      {topSongs.length > 0 && (
        <div className="border-b border-border">
          <p className="px-4 pt-2.5 pb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
            Top Songs
          </p>
          {topSongs.map((song, i) => (
            <div
              key={song.id}
              className={`flex items-center gap-3 px-4 py-2 ${
                i !== 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="text-sm text-muted-foreground/40 w-4 tabular-nums shrink-0">
                {i + 1}
              </span>
              <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-muted border border-border">
                {song.imageUrl ? (
                  <Image
                    src={song.imageUrl}
                    alt={song.title}
                    fill
                    sizes="45px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-[9px] font-black text-foreground uppercase">
                      {song.title.slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm font-bold text-foreground truncate flex-1">
                {toTitleCase(song.title)}
              </p>
              <p className="text-sm tabular-nums text-muted-foreground shrink-0 font-bold">
                {song.totalStreams
                  ? formatNumber(Number(song.totalStreams))
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Best chart */}
      {topChart && (
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground/50 truncate">
            {CHART_LABELS[topChart.chartName] ??
              topChart.chartName.replace(/_/g, " ")}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <p className="text-sm text-muted-foreground">
              Peak{" "}
              <span className="font-bold text-foreground">
                #{topChart.bestPeakPosition ?? "—"}
              </span>
            </p>
            {Number(topChart.weeksAtNumber1) > 0 && (
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-primary">
                  {topChart.weeksAtNumber1}
                </span>{" "}
                wks at #1
              </p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <p className="text-[8px] text-muted-foreground/40">
          Powered by{" "}
          <a
            href={BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            TooXclusive Stats
          </a>
        </p>
        <a
          href={`${BASE_URL}/artists/${artist.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          Full profile →
        </a>
      </div>
    </div>
  );
}
