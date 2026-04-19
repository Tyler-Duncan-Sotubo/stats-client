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
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
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
            <span className="text-xl font-bold text-muted-foreground/30">
              {artist.name[0]}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{artist.name}</p>
        {artist.originCountry && (
          <p className="text-xs text-muted-foreground">
            {artist.originCountry}
          </p>
        )}
        {artist.isAfrobeats && (
          <span className="inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-medium">
            Afrobeats
          </span>
        )}
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
        className={`text-base  tabular-nums text-right font-bold ${
          leftWins ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {leftValue ? formatNumber(left) : "—"}
      </p>
      <p className="text-xs text-muted-foreground/50 text-center w-28 shrink-0">
        {label}
      </p>
      <p
        className={`text-base tabular-nums text-left font-bold ${
          rightWins ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {rightValue ? formatNumber(right) : "—"}
      </p>
    </div>
  );
}

function ChartRow({
  label,
  leftChart,
  rightChart,
}: {
  label: string;
  leftChart: PublicArtist["charts"][0] | undefined;
  rightChart: PublicArtist["charts"][0] | undefined;
}) {
  const leftPeak = leftChart?.bestPeakPosition ?? null;
  const rightPeak = rightChart?.bestPeakPosition ?? null;
  const leftWins =
    leftPeak !== null && (rightPeak === null || leftPeak < rightPeak);
  const rightWins =
    rightPeak !== null && (leftPeak === null || rightPeak < leftPeak);

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 border-t border-border">
      <div
        className={`text-right ${leftWins ? "text-foreground" : "text-muted-foreground"}`}
      >
        {leftChart ? (
          <p className="text-sm font-medium tabular-nums">
            #{leftChart.bestPeakPosition ?? "—"}
            {Number(leftChart.weeksAtNumber1) > 0 && (
              <span className="text-[10px] ml-1 text-primary">
                ({leftChart.weeksAtNumber1}× #1)
              </span>
            )}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </div>
      <p className="text-xs text-muted-foreground/50 text-center w-28 shrink-0">
        {label}
      </p>
      <div
        className={`text-left ${rightWins ? "text-foreground" : "text-muted-foreground"}`}
      >
        {rightChart ? (
          <p className="text-sm font-medium tabular-nums">
            #{rightChart.bestPeakPosition ?? "—"}
            {Number(rightChart.weeksAtNumber1) > 0 && (
              <span className="text-[10px] ml-1 text-primary">
                ({rightChart.weeksAtNumber1}× #1)
              </span>
            )}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </div>
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
          className={`text-base tabular-nums text-right font-bold ${leftWins >= rightWins ? "text-foreground" : "text-muted-foreground"}`}
        >
          {leftWins > 0 ? leftWins : leftNoms > 0 ? `${leftNoms} noms` : "—"}
        </p>
        <p className="text-xs text-muted-foreground/50 text-center w-28 shrink-0">
          Grammy
        </p>
        <p
          className={`text-base tabular-nums text-left font-bold ${rightWins >= leftWins ? "text-foreground" : "text-muted-foreground"}`}
        >
          {rightWins > 0
            ? rightWins
            : rightNoms > 0
              ? `${rightNoms} noms`
              : "—"}
        </p>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 border-t border-border">
        <p
          className={`text-base tabular-nums text-right font-bold ${leftTotalWins >= rightTotalWins ? "text-foreground" : "text-muted-foreground"}`}
        >
          {leftTotalWins > 0 ? leftTotalWins : "—"}
        </p>
        <p className="text-xs text-muted-foreground/50 text-center w-28 shrink-0">
          Award Wins
        </p>
        <p
          className={`text-base tabular-nums text-left font-bold ${rightTotalWins >= leftTotalWins ? "text-foreground" : "text-muted-foreground"}`}
        >
          {rightTotalWins > 0 ? rightTotalWins : "—"}
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
    <div className="flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1.5">
          <LogoMark size="lg" />
          <span className="text-xs font-semibold text-muted-foreground tracking-wide">
            TooXclusive Stats
          </span>
        </div>
        <span className="text-xs text-muted-foreground/50">
          Artist Comparison
        </span>
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
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
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
          <p className="text-xs text-muted-foreground/40">
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
          {left && right && (
            <a
              href={`${BASE_URL}/compare?left=${left.slug}&right=${right.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Full comparison →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
