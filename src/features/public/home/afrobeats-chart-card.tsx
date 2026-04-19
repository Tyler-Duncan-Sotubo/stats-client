import type { ChartEntry } from "@/lib/api/public";
import { StatCard } from "./stat-card";
import { toTitleCase } from "@/shared/utils/format";

interface AfrobeatsChartCardProps {
  tooxclusive: ChartEntry[];
}

export function AfrobeatsChartCard({ tooxclusive }: AfrobeatsChartCardProps) {
  const top1 = tooxclusive.find((e) => e.position === 1);

  const uniqueArtists = new Set(tooxclusive.map((e) => e.artistId)).size;

  const top10Artists = tooxclusive
    .filter((e) => e.position <= 10)
    .map((e) => toTitleCase(e.artistName))
    .filter((name, i, arr) => arr.indexOf(name) === i)
    .slice(0, 2)
    .join(", ");

  const chartDate = top1?.chartWeek
    ? new Date(top1.chartWeek).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : null;

  const badge = chartDate ? (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-orange-300/20 px-2.5 py-1 text-xs font-semibold text-orange-100 ring-1 ring-orange-200/20">
      <span>Week of {chartDate}</span>
    </span>
  ) : null;

  return (
    <StatCard
      label="Afrobeats #1"
      value={top1 ? toTitleCase(top1.songTitle) : "—"}
      lines={
        [
          top1?.artistName ? toTitleCase(top1.artistName) : null,
          top10Artists ? `Top 10: ${top10Artists}...` : null,
          `${uniqueArtists} artists charting`,
        ].filter(Boolean) as string[]
      }
      badge={badge}
      imageUrl={top1?.artistImageUrl}
      imageAlt={top1?.artistName}
      href="/charts/tooxclusive_top_100/NG"
      backgroundColor="#0C1A2E"
    />
  );
}
