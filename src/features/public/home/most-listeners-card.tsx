import type { LeaderboardEntry } from "@/lib/api/public";
import { StatCard } from "./stat-card";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { cn } from "@/lib/utils";
import { getCountryName } from "@/shared/utils/get-country-name";

interface MostListenersCardProps {
  artist: LeaderboardEntry | null;
}

export function MostListenersCard({ artist }: MostListenersCardProps) {
  const change = artist?.dailyChange ?? 0;
  const isUp = change > 0;
  const isDown = change < 0;

  const badge =
    change !== 0 ? (
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
          isUp &&
            "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/20",
          isDown && "bg-red-400/20 text-red-200 ring-1 ring-red-300/20",
        )}
      >
        <span className="text-sm leading-none">{isUp ? "↑" : "↓"}</span>
        <span>
          {formatNumber(Math.abs(change))} {isUp ? "gained" : "lost"} vs
          yesterday
        </span>
      </span>
    ) : null;

  return (
    <StatCard
      label="Most Monthly Listeners"
      value={
        artist?.monthlyListeners ? formatNumber(artist.monthlyListeners) : "—"
      }
      lines={
        [
          artist?.artistName ? toTitleCase(artist.artistName) : null,
          getCountryName(artist?.originCountry),
          artist?.peakListeners
            ? `Peak: ${formatNumber(artist.peakListeners)} listeners`
            : null,
        ].filter(Boolean) as string[]
      }
      badge={badge}
      imageUrl={artist?.artistImageUrl}
      imageAlt={artist?.artistName}
      href={artist?.artistSlug ? `/artists/${artist.artistSlug}` : undefined}
      backgroundColor="#134E4A"
    />
  );
}
