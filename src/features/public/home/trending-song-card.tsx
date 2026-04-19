import type { TrendingSong } from "@/lib/api/public";
import { StatCard } from "./stat-card";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { cn } from "@/lib/utils";

interface TrendingSongCardProps {
  songs: TrendingSong[];
}

export function TrendingSongCard({ songs }: TrendingSongCardProps) {
  const topSong = songs[0];

  const growth = topSong?.dailyGrowth ?? 0;
  const isUp = growth > 0;

  const badge =
    growth !== 0 ? (
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
          isUp
            ? "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/20"
            : "bg-red-400/20 text-red-200 ring-1 ring-red-300/20",
        )}
      >
        <span className="text-sm leading-none">{isUp ? "↑" : "↓"}</span>
        <span>{formatNumber(Math.abs(growth))} vs yesterday</span>
      </span>
    ) : null;

  return (
    <StatCard
      label="Top Song Today"
      value={topSong ? formatNumber(topSong.dailyStreams ?? 0) : "—"}
      lines={
        [
          topSong?.artistName && topSong?.title
            ? `${toTitleCase(topSong.artistName)} — ${toTitleCase(topSong.title)}`
            : null,
          topSong?.bestChartPeak && topSong?.bestChartName
            ? `Peak #${topSong.bestChartPeak}`
            : null,
        ].filter(Boolean) as string[]
      }
      badge={badge}
      imageUrl={topSong?.artistImageUrl}
      imageAlt={topSong?.title}
      href={topSong?.slug ? `/songs/${topSong.slug}` : undefined}
      backgroundColor="#7C2D12"
    />
  );
}
