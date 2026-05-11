import type { RecentMilestone } from "@/lib/api/public";
import { MilestoneFactsFilters } from "./milestone-facts-filters";
import { MilestoneFactsList } from "./milestone-facts-list";
import { MilestoneFactsPagination } from "./milestone-facts-pagination";
import { Zap } from "lucide-react";

interface Props {
  data: RecentMilestone[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  currentIsAfrobeats?: boolean;
  currentMetric?: string;
}

function StatPill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 flex-1 min-w-25">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-lg font-bold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

export function MilestoneFactsHubView({
  data,
  meta,
  currentIsAfrobeats,
  currentMetric,
}: Props) {
  // derive quick stats from current page
  const songMilestones = data.filter((m) => !!m.songId).length;
  const artistMilestones = data.filter((m) => !m.songId).length;
  const afrobeatsMilestones = data.filter((m) => m.isAfrobeats).length;

  return (
    <div className="pb-16 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Milestone Facts
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Every artist and song that has crossed a major Spotify streaming
              threshold — tracked and timestamped.
            </p>
          </div>
        </div>
      </div>

      {/* Stat pills */}
      <div className="flex items-stretch gap-3 mb-8 flex-wrap">
        <StatPill
          label="Total milestones"
          value={meta.total.toLocaleString()}
        />
        <StatPill label="On this page" value={data.length} />
        <StatPill label="Artist milestones" value={artistMilestones} />
        <StatPill label="Song milestones" value={songMilestones} />
        {afrobeatsMilestones > 0 && (
          <StatPill label="Afrobeats" value={afrobeatsMilestones} />
        )}
      </div>

      {/* Filters */}
      <MilestoneFactsFilters
        currentIsAfrobeats={currentIsAfrobeats}
        currentMetric={currentMetric}
      />

      {/* List */}
      <MilestoneFactsList data={data} offset={(meta.page - 1) * meta.limit} />

      {/* Pagination */}
      <MilestoneFactsPagination
        page={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
        limit={meta.limit}
      />
    </div>
  );
}
