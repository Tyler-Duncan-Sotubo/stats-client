import type { PublicSong } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { BarChart2, Headphones, Calendar, Music } from "lucide-react";

export function SongStatRow({ song }: { song: PublicSong }) {
  const stats = [
    {
      icon: <BarChart2 className="w-4 h-4" />,
      label: "Total Streams",
      value: song.totalStreams ? formatNumber(Number(song.totalStreams)) : "—",
    },
    {
      icon: <Headphones className="w-4 h-4" />,
      label: "Daily Streams",
      value: song.dailyStreams ? formatNumber(Number(song.dailyStreams)) : "—",
    },
    {
      icon: <Music className="w-4 h-4" />,
      label: "Charts",
      value: song.charts.length ? String(song.charts.length) : "—",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Last Updated",
      value: song.streamSnapshotDate
        ? new Date(song.streamSnapshotDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-card px-4 py-4"
        >
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            {stat.icon}
            <p className="text-xs font-semibold uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
          <p className="text-xl font-bold tabular-nums text-foreground">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
