// features/public/compare/compare-embed-view.tsx
"use client";

import Image from "next/image";
import { formatNumber } from "@/shared/utils/format";
import type { PublicArtist } from "@/lib/api/public";
import { LogoMark } from "@/shared/ui/logo";

interface Props {
  left: PublicArtist | null;
  right: PublicArtist | null;
}

const STATS = [
  { label: "Total Streams", key: "totalStreams" as keyof PublicArtist },
  { label: "Monthly Listeners", key: "monthlyListeners" as keyof PublicArtist },
  { label: "Daily Streams", key: "dailyStreams" as keyof PublicArtist },
  { label: "Track Count", key: "trackCount" as keyof PublicArtist },
];

const BASE_URL = "https://tooxclusive.com/stats";

function ArtistHeader({ artist }: { artist: PublicArtist }) {
  const ukChart = artist.charts?.find(
    (c) =>
      c.chartName === "uk_official_singles" ||
      c.chartName === "official_afrobeats_chart",
  );
  const billboardChart = artist.charts?.find(
    (c) => c.chartName === "billboard_hot_100",
  );

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <a
        href={`${BASE_URL}/artists/${artist.slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0 hover:opacity-80 transition-opacity"
      >
        {artist.imageUrl ? (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xl font-bold text-white">
              {artist.name[0]}
            </span>
          </div>
        )}
      </a>
      <div>
        <p className="text-base font-bold text-white">{artist.name}</p>
        <div className="flex items-center justify-center gap-1.5 mt-0.5 flex-wrap">
          {ukChart && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-medium">
              UK #{ukChart.bestPeakPosition}
              {Number(ukChart.weeksAtNumber1) > 0 && (
                <span className="text-primary ml-0.5">
                  ({ukChart.weeksAtNumber1}× #1)
                </span>
              )}
            </span>
          )}
          {billboardChart && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-medium">
              BB #{billboardChart.bestPeakPosition}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  leftValue,
  rightValue,
}: {
  label: string;
  leftValue: number | null;
  rightValue: number | null;
}) {
  const left = Number(leftValue ?? 0);
  const right = Number(rightValue ?? 0);
  const leftWins = left > right;
  const rightWins = right > left;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 border-t border-border">
      <p
        className={`text-base tabular-nums text-right font-bold ${
          leftWins ? "text-white" : "text-white/60"
        }`}
      >
        {leftValue ? formatNumber(left) : "—"}
      </p>
      <p className="text-xs text-white/40 text-center w-28 shrink-0">{label}</p>
      <p
        className={`text-base tabular-nums text-left font-bold ${
          rightWins ? "text-white" : "text-white/60"
        }`}
      >
        {rightValue ? formatNumber(right) : "—"}
      </p>
    </div>
  );
}

function AwardRow({
  leftAwards,
  rightAwards,
}: {
  leftAwards: PublicArtist["awardsSummary"] | null;
  rightAwards: PublicArtist["awardsSummary"] | null;
}) {
  const leftWins = Number(leftAwards?.grammyWins ?? 0);
  const rightWins = Number(rightAwards?.grammyWins ?? 0);
  const leftNoms = Number(leftAwards?.grammyNominations ?? 0);
  const rightNoms = Number(rightAwards?.grammyNominations ?? 0);
  const leftTotalWins = Number(leftAwards?.totalWins ?? 0);
  const rightTotalWins = Number(rightAwards?.totalWins ?? 0);

  return (
    <>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 border-t border-border">
        <p
          className={`text-base tabular-nums text-right font-bold ${leftWins >= rightWins ? "text-white" : "text-white/60"}`}
        >
          {leftWins > 0 ? leftWins : leftNoms > 0 ? `${leftNoms} noms` : "—"}
        </p>
        <p className="text-xs text-white/40 text-center w-28 shrink-0">
          Grammy
        </p>
        <p
          className={`text-base tabular-nums text-left font-bold ${rightWins >= leftWins ? "text-white" : "text-white/60"}`}
        >
          {rightWins > 0
            ? rightWins
            : rightNoms > 0
              ? `${rightNoms} noms`
              : "—"}
        </p>
      </div>
    </>
  );
}

export function CompareEmbedView({ left, right }: Props) {
  if (!left && !right) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No artists selected
      </div>
    );
  }

  // Find shared chart names to compare
  const leftChartNames = new Set(left?.charts?.map((c) => c.chartName) ?? []);
  const rightChartNames = new Set(right?.charts?.map((c) => c.chartName) ?? []);
  const sharedCharts = [...leftChartNames].filter((c) =>
    rightChartNames.has(c),
  );
  const allChartNames = [
    ...new Set([
      ...(left?.charts?.map((c) => c.chartName) ?? []),
      ...(right?.charts?.map((c) => c.chartName) ?? []),
    ]),
  ].slice(0, 3);

  return (
    <div className="flex flex-col bg-black rounded-xl border border-border text-white">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-1.5">
          <LogoMark size="lg" />
        </div>
        <span className="text-xs">Artist Comparison</span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Artist headers */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            {left ? (
              <ArtistHeader artist={left} />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-muted" />
                <p className="text-xs text-muted-foreground">—</p>
              </div>
            )}
          </div>
          <div>
            {right ? (
              <ArtistHeader artist={right} />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-muted" />
                <p className="text-xs text-muted-foreground">—</p>
              </div>
            )}
          </div>
        </div>

        {/* Spotify stats */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80 mb-1">
            Spotify
          </p>
          {STATS.map((stat) => (
            <StatRow
              key={stat.label}
              label={stat.label}
              leftValue={left?.[stat.key] as number | null}
              rightValue={right?.[stat.key] as number | null}
            />
          ))}
        </div>

        {/* Awards */}
        {(left?.awardsSummary || right?.awardsSummary) && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80 mb-1">
              Awards
            </p>
            <AwardRow
              leftAwards={left?.awardsSummary ?? null}
              rightAwards={right?.awardsSummary ?? null}
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-[9px]">
            Powered by{"  "}
            <a
              href={BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold"
            >
              TooXclusive
            </a>
          </p>
          {left && right && (
            <a
              href={`${BASE_URL}/compare?left=${left.slug}&right=${right.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline font-bold"
            >
              Full comparison →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
