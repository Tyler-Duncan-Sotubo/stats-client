import Image from "next/image";
import Link from "next/link";
import type { RecentMilestone } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";

function formatThreshold(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function metricLabel(metric: string): string {
  if (metric === "monthly_listeners") return "monthly listeners";
  return "streams";
}

export function buildFactSlug(milestone: RecentMilestone): string {
  const num = formatThreshold(Number(milestone.threshold)).toLowerCase();
  if (milestone.songId) {
    return `${milestone.artistSlug}-${milestone.songSlug}-${num}-streams-spotify`;
  }
  if (milestone.metric === "monthly_listeners") {
    return `${milestone.artistSlug}-${num}-monthly-listeners-spotify`;
  }
  return `${milestone.artistSlug}-${num}-streams-spotify`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

interface Props {
  data: RecentMilestone[];
  offset?: number;
}

export function MilestoneFactsList({ data, offset = 0 }: Props) {
  if (!data.length) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-muted-foreground">No milestones found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {data.map((milestone, i) => {
        const isSong = !!milestone.songId;
        const image = isSong
          ? milestone.songImageUrl
          : milestone.artistImageUrl;
        const name = isSong
          ? (milestone.songTitle ?? "")
          : (milestone.artistName ?? "");
        const sub = isSong ? milestone.artistName : null;
        const slug = buildFactSlug(milestone);
        const rank = offset + i + 1;

        return (
          <Link
            key={milestone.id}
            href={`/milestones/facts/${slug}`}
            className="flex items-center gap-3 px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/40 transition-colors group"
          >
            {/* Rank */}
            <span className="w-6 shrink-0 text-xs font-mono text-muted-foreground/40 text-right">
              {rank}
            </span>

            {/* Image */}
            <div
              className={`relative w-10 h-10 shrink-0 overflow-hidden bg-muted ${isSong ? "rounded-md" : "rounded-full"}`}
            >
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground/30">
                    {name[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm font-medium text-foreground truncate">
                  {isSong ? `"${name}"` : name}
                </p>
                {milestone.isAfrobeats && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-1.5 py-0.5 shrink-0">
                    Afrobeats
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {sub && (
                  <p className="text-xs text-muted-foreground truncate">
                    {sub}
                  </p>
                )}
                {sub && milestone.streamValue && (
                  <span className="text-muted-foreground/30 text-xs">·</span>
                )}
                {milestone.streamValue && (
                  <p className="text-xs text-muted-foreground shrink-0">
                    {formatNumber(Number(milestone.streamValue))} at crossing
                  </p>
                )}
              </div>
            </div>

            {/* Right — badge + time */}
            <div className="shrink-0 text-right flex flex-col items-end gap-1">
              <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2.5 py-0.5 whitespace-nowrap">
                {formatThreshold(Number(milestone.threshold))}{" "}
                {metricLabel(milestone.metric)}
              </span>
              <p className="text-[10px] text-muted-foreground">
                {timeAgo(milestone.crossedAt)}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
