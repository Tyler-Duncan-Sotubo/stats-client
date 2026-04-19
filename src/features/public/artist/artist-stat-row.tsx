import type { PublicArtist } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import {
  Music,
  Headphones,
  BarChart2,
  Calendar,
  TrendingUp,
} from "lucide-react";

export function ArtistStatRow({ artist }: { artist: PublicArtist }) {
  const stats = [
    {
      icon: <BarChart2 className="w-4 h-4" />,
      label: "Total Streams",
      value: artist.totalStreams
        ? formatNumber(Number(artist.totalStreams))
        : "—",
    },
    {
      icon: <Headphones className="w-4 h-4" />,
      label: "Monthly Listeners",
      value: artist.monthlyListeners
        ? formatNumber(Number(artist.monthlyListeners))
        : "—",
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "Peak Listeners",
      value: artist.peakListeners
        ? formatNumber(Number(artist.peakListeners))
        : "—",
    },
    {
      icon: <Music className="w-4 h-4" />,
      label: "Daily Streams",
      value: artist.dailyStreams
        ? formatNumber(Number(artist.dailyStreams))
        : "—",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Track Count",
      value: artist.trackCount ? artist.trackCount.toLocaleString() : "—",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
