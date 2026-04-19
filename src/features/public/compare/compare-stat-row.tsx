import type { PublicArtist } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";

interface Stat {
  label: string;
  left: string | number | null;
  right: string | number | null;
  numeric?: number | null;
  numericRight?: number | null;
  higherIsBetter?: boolean;
}

interface CompareStatRowProps {
  left: PublicArtist;
  right: PublicArtist;
}

function getStats(left: PublicArtist, right: PublicArtist): Stat[] {
  const ukAfroLeft = left.charts.find(
    (c) => c.chartName === "official_afrobeats_chart" && c.role === "primary",
  );
  const ukAfroRight = right.charts.find(
    (c) => c.chartName === "official_afrobeats_chart" && c.role === "primary",
  );

  const grammyWinsLeft = left.awards.filter(
    (a) => a.awardBody === "Grammy" && a.result === "won",
  ).length;
  const grammyWinsRight = right.awards.filter(
    (a) => a.awardBody === "Grammy" && a.result === "won",
  ).length;

  const certUnitsLeft = left.certifications.reduce(
    (sum, c) => sum + Number(c.totalPlatinumUnits),
    0,
  );
  const certUnitsRight = right.certifications.reduce(
    (sum, c) => sum + Number(c.totalPlatinumUnits),
    0,
  );

  const topSongLeft = left.topSongs[0];
  const topSongRight = right.topSongs[0];

  return [
    {
      label: "Total Streams",
      left: left.totalStreams ? formatNumber(Number(left.totalStreams)) : "—",
      right: right.totalStreams
        ? formatNumber(Number(right.totalStreams))
        : "—",
      numeric: Number(left.totalStreams ?? 0),
      numericRight: Number(right.totalStreams ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Monthly Listeners",
      left: left.monthlyListeners
        ? formatNumber(Number(left.monthlyListeners))
        : "—",
      right: right.monthlyListeners
        ? formatNumber(Number(right.monthlyListeners))
        : "—",
      numeric: Number(left.monthlyListeners ?? 0),
      numericRight: Number(right.monthlyListeners ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Daily Streams",
      left: left.dailyStreams ? formatNumber(Number(left.dailyStreams)) : "—",
      right: right.dailyStreams
        ? formatNumber(Number(right.dailyStreams))
        : "—",
      numeric: Number(left.dailyStreams ?? 0),
      numericRight: Number(right.dailyStreams ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Peak Listeners",
      left: left.peakListeners ? formatNumber(Number(left.peakListeners)) : "—",
      right: right.peakListeners
        ? formatNumber(Number(right.peakListeners))
        : "—",
      numeric: Number(left.peakListeners ?? 0),
      numericRight: Number(right.peakListeners ?? 0),
      higherIsBetter: true,
    },
    {
      label: "UK Afrobeats #1 Weeks",
      left: ukAfroLeft ? Number(ukAfroLeft.weeksAtNumber1) : 0,
      right: ukAfroRight ? Number(ukAfroRight.weeksAtNumber1) : 0,
      numeric: ukAfroLeft ? Number(ukAfroLeft.weeksAtNumber1) : 0,
      numericRight: ukAfroRight ? Number(ukAfroRight.weeksAtNumber1) : 0,
      higherIsBetter: true,
    },
    {
      label: "UK Afrobeats Top 10",
      left: ukAfroLeft ? Number(ukAfroLeft.weeksInTop10) : 0,
      right: ukAfroRight ? Number(ukAfroRight.weeksInTop10) : 0,
      numeric: ukAfroLeft ? Number(ukAfroLeft.weeksInTop10) : 0,
      numericRight: ukAfroRight ? Number(ukAfroRight.weeksInTop10) : 0,
      higherIsBetter: true,
    },
    {
      label: "Grammy Wins",
      left: grammyWinsLeft,
      right: grammyWinsRight,
      numeric: grammyWinsLeft,
      numericRight: grammyWinsRight,
      higherIsBetter: true,
    },
    {
      label: "Platinum Units",
      left: certUnitsLeft ? formatNumber(certUnitsLeft) : "—",
      right: certUnitsRight ? formatNumber(certUnitsRight) : "—",
      numeric: certUnitsLeft,
      numericRight: certUnitsRight,
      higherIsBetter: true,
    },
    {
      label: "Top Song Streams",
      left: topSongLeft?.totalStreams
        ? formatNumber(Number(topSongLeft.totalStreams))
        : "—",
      right: topSongRight?.totalStreams
        ? formatNumber(Number(topSongRight.totalStreams))
        : "—",
      numeric: Number(topSongLeft?.totalStreams ?? 0),
      numericRight: Number(topSongRight?.totalStreams ?? 0),
      higherIsBetter: true,
    },
    {
      label: "Track Count",
      left: left.trackCount ?? "—",
      right: right.trackCount ?? "—",
      numeric: left.trackCount ?? 0,
      numericRight: right.trackCount ?? 0,
      higherIsBetter: true,
    },
  ];
}

export function CompareStatRow({ left, right }: CompareStatRowProps) {
  const stats = getStats(left, right).filter((stat) => {
    const l = stat.numeric ?? 0;
    const r = stat.numericRight ?? 0;
    return !(l === 0 && r === 0);
  });

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {stats.map((stat, i) => {
        const l = stat.numeric ?? 0;
        const r = stat.numericRight ?? 0;
        const leftWins = stat.higherIsBetter ? l > r : l < r;
        const rightWins = stat.higherIsBetter ? r > l : r < l;
        const isDraw = l === r;

        return (
          <div
            key={stat.label}
            className={`grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 ${
              i !== stats.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="text-right">
              <p
                className={`text-lg font-bold tabular-nums ${leftWins ? "text-foreground" : "text-muted-foreground"}`}
              >
                {String(stat.left)}
              </p>
              {leftWins && !isDraw && (
                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
                  Winner
                </p>
              )}
            </div>

            <div className="text-center px-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">
                {stat.label}
              </p>
              {isDraw && l !== 0 && (
                <p className="text-xs text-muted-foreground">Draw</p>
              )}
            </div>

            <div className="text-left">
              <p
                className={`text-lg font-bold tabular-nums ${rightWins ? "text-foreground" : "text-muted-foreground"}`}
              >
                {String(stat.right)}
              </p>
              {rightWins && !isDraw && (
                <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
                  Winner
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
