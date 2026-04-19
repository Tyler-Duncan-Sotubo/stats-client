import Image from "next/image";
import type { PublicArtist } from "@/lib/api/public";

interface CompareScoreCardProps {
  left: PublicArtist;
  right: PublicArtist;
}

function countWins(left: PublicArtist, right: PublicArtist) {
  const comparisons = [
    [Number(left.totalStreams ?? 0), Number(right.totalStreams ?? 0)],
    [Number(left.monthlyListeners ?? 0), Number(right.monthlyListeners ?? 0)],
    [Number(left.dailyStreams ?? 0), Number(right.dailyStreams ?? 0)],
    [Number(left.peakListeners ?? 0), Number(right.peakListeners ?? 0)],
    [
      Number(
        left.charts.find(
          (c) =>
            c.chartName === "official_afrobeats_chart" && c.role === "primary",
        )?.weeksAtNumber1 ?? 0,
      ),
      Number(
        right.charts.find(
          (c) =>
            c.chartName === "official_afrobeats_chart" && c.role === "primary",
        )?.weeksAtNumber1 ?? 0,
      ),
    ],
    [
      Number(
        left.charts.find(
          (c) =>
            c.chartName === "official_afrobeats_chart" && c.role === "primary",
        )?.weeksInTop10 ?? 0,
      ),
      Number(
        right.charts.find(
          (c) =>
            c.chartName === "official_afrobeats_chart" && c.role === "primary",
        )?.weeksInTop10 ?? 0,
      ),
    ],
    [
      left.awards.filter((a) => a.awardBody === "Grammy" && a.result === "won")
        .length,
      right.awards.filter((a) => a.awardBody === "Grammy" && a.result === "won")
        .length,
    ],
    [
      left.certifications.reduce(
        (sum, c) => sum + Number(c.totalPlatinumUnits),
        0,
      ),
      right.certifications.reduce(
        (sum, c) => sum + Number(c.totalPlatinumUnits),
        0,
      ),
    ],
    [
      Number(left.topSongs[0]?.totalStreams ?? 0),
      Number(right.topSongs[0]?.totalStreams ?? 0),
    ],
    [left.trackCount ?? 0, right.trackCount ?? 0],
  ].filter(([l, r]) => !(l === 0 && r === 0)); // exclude both-zero stats

  let leftWins = 0;
  let rightWins = 0;
  let draws = 0;

  for (const [l, r] of comparisons) {
    if (l > r) leftWins++;
    else if (r > l) rightWins++;
    else draws++;
  }

  return { leftWins, rightWins, draws, total: comparisons.length };
}

export function CompareScoreCard({ left, right }: CompareScoreCardProps) {
  const { leftWins, rightWins, draws, total } = countWins(left, right);
  const leftPct = Math.round((leftWins / total) * 100);
  const rightPct = Math.round((rightWins / total) * 100);
  const winner =
    leftWins > rightWins ? left : rightWins > leftWins ? right : null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Winner banner */}
      {winner && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2.5 flex items-center gap-2">
          <p className="text-sm font-semibold text-amber-600">
            {winner.name} wins this comparison
          </p>
        </div>
      )}

      {!winner && (
        <div className="bg-muted/40 border-b border-border px-5 py-2.5">
          <p className="text-sm font-semibold text-muted-foreground text-center">
            It's a draw
          </p>
        </div>
      )}

      <div className="px-5 py-5">
        {/* Names + scores */}
        <div className="grid grid-cols-3 items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
              {left.imageUrl && (
                <Image
                  src={left.imageUrl}
                  alt={left.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{left.name}</p>
              <p className="text-2xl font-black tabular-nums text-foreground">
                {leftWins}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
              vs
            </p>
            {draws > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {draws} draw{draws !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 justify-end">
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{right.name}</p>
              <p className="text-2xl font-black tabular-nums text-foreground">
                {rightWins}
              </p>
            </div>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
              {right.imageUrl && (
                <Image
                  src={right.imageUrl}
                  alt={right.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="bg-blue-900 transition-all duration-700"
            style={{ width: `${leftPct}%` }}
          />
          <div
            className="bg-rose-500 transition-all duration-700"
            style={{ width: `${rightPct}%` }}
          />
        </div>

        <div className="flex justify-between mt-1.5">
          <p className="text-xs font-semibold text-blue-900">{leftPct}%</p>
          <p className="text-xs text-muted-foreground">{total} categories</p>
          <p className="text-xs font-semibold text-rose-500">{rightPct}%</p>
        </div>
      </div>
    </div>
  );
}
