import Link from "next/link";
import { formatNumber } from "@/shared/utils/format";

interface ArtistAudiomackStatsProps {
  stats: {
    audiomackSlug: string;
    snapshotDate: string;
    totalPlays: string | number;
    monthlyPlays: string | number;
    followers: string | number;
  };
}

export function ArtistAudiomackStats({ stats }: ArtistAudiomackStatsProps) {
  if (!stats || Number(stats.totalPlays) === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-orange-500/10 border-b border-orange-500/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <h3 className="text-sm font-bold text-orange-500 uppercase tracking-widest">
            Audiomack
          </h3>
        </div>
        <Link
          href={`https://audiomack.com/${stats.audiomackSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-orange-500 hover:underline font-medium"
        >
          View profile →
        </Link>
      </div>

      {/* Stats — vertical stack for narrow containers */}
      <div className="divide-y divide-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-8 rounded-full bg-orange-500" />
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold">
              Total Plays
            </p>
          </div>
          <p className="text-base font-bold tabular-nums text-foreground">
            {formatNumber(Number(stats.totalPlays))}
          </p>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-8 rounded-full bg-amber-500" />
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold">
              Monthly Plays
            </p>
          </div>
          <p className="text-base font-bold tabular-nums text-foreground">
            {formatNumber(Number(stats.monthlyPlays))}
          </p>
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-8 rounded-full bg-yellow-500" />
            <p className="text-xs text-muted-foreground/60 uppercase tracking-widest font-semibold">
              Followers
            </p>
          </div>
          <p className="text-base font-bold tabular-nums text-foreground">
            {formatNumber(Number(stats.followers))}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-muted/30 border-t border-border">
        <p className="text-xs text-muted-foreground/40">
          Updated{" "}
          {new Date(stats.snapshotDate).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
