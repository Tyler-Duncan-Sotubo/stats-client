// features/ask/chart-list.tsx  (replaces the inline ChartList in ask-view)
"use client";

import Link from "next/link";
import { CHART_LABELS } from "@/lib/constants/charts";
import { ChartEntryRow } from "@/shared/ui/chart-entry-row";

export function ChartList({ data }: { data: any }) {
  const chartLabel =
    CHART_LABELS[data.chartName] ??
    data.chartName.replace(/_/g, " ").toUpperCase();

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card mb-6">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <p className="text-xs font-semibold text-foreground">{chartLabel}</p>
        <p className="text-xs text-muted-foreground/50">
          {data.chartTerritory} · {data.chartWeek}
        </p>
      </div>

      {data.data.map((entry: any, i: number) => (
        <ChartEntryRow
          key={entry.entryId}
          position={entry.position}
          trend={entry.trend}
          delta={entry.delta}
          songTitle={entry.songTitle}
          artistName={entry.artistName}
          imageUrl={entry.songImageUrl ?? entry.artistImageUrl} // ← same fallback as chart detail
          peakPosition={entry.peakPosition}
          weeksOnChart={entry.weeksOnChart}
          href={entry.songSlug ? `/songs/${entry.songSlug}` : undefined}
          isFirst={i === 0}
        />
      ))}
    </div>
  );
}
