import type { ChartEntry } from "@/lib/api/public";
import { StatCard } from "./stat-card";
import { toTitleCase } from "@/shared/utils/format";

interface SpotifyChartCardProps {
  spotify: ChartEntry[];
}

export function SpotifyChartCard({ spotify }: SpotifyChartCardProps) {
  const top1 = spotify[0] ?? null;

  const badge = (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-green-300/20 px-2.5 py-1 text-xs font-semibold text-green-100 ring-1 ring-green-200/20">
      <span>Daily · Nigeria</span>
    </span>
  );

  return (
    <StatCard
      label="Spotify Nigeria #1"
      value={top1 ? toTitleCase(top1.songTitle) : "—"}
      lines={
        [top1?.artistName ? toTitleCase(top1.artistName) : null].filter(
          Boolean,
        ) as string[]
      }
      badge={badge}
      imageUrl={top1?.artistImageUrl}
      imageAlt={top1?.artistName}
      href="/charts/spotify_daily_ng/NG"
      backgroundColor="#1DB954"
    />
  );
}
