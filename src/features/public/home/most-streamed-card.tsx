import type { LeaderboardEntry } from "@/lib/api/public";
import { StatCard } from "./stat-card";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { cn } from "@/lib/utils";
import { getCountryName } from "@/shared/utils/get-country-name";
import { TrendingUp } from "lucide-react";

interface MostStreamedCardProps {
  artist: LeaderboardEntry | null;
}

export function MostStreamedCard({ artist }: MostStreamedCardProps) {
  const dailyStreams = artist?.dailyStreams ?? 0;

  const badge =
    dailyStreams > 0 ? (
      <span
        className={cn(
          "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
          "bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/20",
        )}
      >
        <TrendingUp className="h-3.5 w-3.5" />
        <span>{formatNumber(dailyStreams)} vs yesterday</span>
      </span>
    ) : null;

  return (
    <StatCard
      label="Most Streamed Afrobeats Artist"
      value={artist?.totalStreams ? formatNumber(artist.totalStreams) : "—"}
      lines={
        [
          artist?.artistName ? toTitleCase(artist.artistName) : null,
          getCountryName(artist?.originCountry),
          artist?.rank ? `Ranked #${artist.rank} globally` : null,
        ].filter(Boolean) as string[]
      }
      badge={badge}
      imageUrl={artist?.artistImageUrl}
      imageAlt={artist?.artistName}
      href={artist?.artistSlug ? `/artists/${artist.artistSlug}` : undefined}
      backgroundColor="#1C1917"
    />
  );
}
