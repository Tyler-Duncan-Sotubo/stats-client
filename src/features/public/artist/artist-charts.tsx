"use client";

import type { ArtistChart } from "@/lib/api/public";
import { CHART_LABELS } from "@/lib/constants/charts";
import { DataTable } from "@/shared/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<ArtistChart>[] = [
  {
    id: "chart",
    header: "Chart",
    cell: ({ row }) => {
      const c = row.original;
      return (
        <div>
          <p className="text-sm font-semibold text-foreground">
            {CHART_LABELS[c.chartName] ?? c.chartName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {c.chartTerritory} · {c.role}
            {c.firstChartAppearance && (
              <> · Since {new Date(c.firstChartAppearance).getFullYear()}</>
            )}
          </p>
        </div>
      );
    },
  },
  {
    id: "peak",
    header: "Peak",
    size: 70,
    cell: ({ row }) => (
      <p className="text-sm font-bold tabular-nums">
        #{row.original.bestPeakPosition ?? "—"}
      </p>
    ),
  },
  {
    id: "weeksAt1",
    header: "Weeks #1",
    size: 90,
    cell: ({ row }) => (
      <p className="text-sm font-bold tabular-nums">
        {Number(row.original.weeksAtNumber1)}
      </p>
    ),
  },
  {
    id: "top10",
    header: "Top 10",
    size: 80,
    cell: ({ row }) => (
      <p className="text-sm font-bold tabular-nums">
        {Number(row.original.weeksInTop10)}
      </p>
    ),
  },
  {
    id: "songs",
    header: "Songs",
    size: 70,
    cell: ({ row }) => (
      <p className="text-sm font-bold tabular-nums">
        {Number(row.original.distinctSongsCharted)}
      </p>
    ),
  },
  {
    id: "total",
    header: "Total Wks",
    size: 90,
    cell: ({ row }) => (
      <p className="text-sm font-bold tabular-nums">
        {Number(row.original.totalChartWeeks)}
      </p>
    ),
  },
];

function MobileChartList({ charts }: { charts: ArtistChart[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {charts.map((c, i) => (
        <div
          key={`${c.chartName}-${c.chartTerritory}`}
          className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-border last:border-0"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">
              {CHART_LABELS[c.chartName] ?? c.chartName}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {c.role}
              {c.firstChartAppearance && (
                <> · Since {new Date(c.firstChartAppearance).getFullYear()}</>
              )}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold tabular-nums text-foreground">
              #{c.bestPeakPosition ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {Number(c.totalChartWeeks)} wks
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArtistCharts({ charts }: { charts: ArtistChart[] }) {
  if (!charts.length) return null;

  const seen = new Map<string, ArtistChart>();
  for (const c of charts) {
    const key = `${c.chartName}-${c.chartTerritory}`;
    const existing = seen.get(key);
    if (!existing || c.role === "primary") seen.set(key, c);
  }
  const deduped = Array.from(seen.values()).sort(
    (a, b) => (a.bestPeakPosition ?? 999) - (b.bestPeakPosition ?? 999),
  );

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Chart History
      </h2>

      {/* Mobile */}
      <div className="sm:hidden">
        <MobileChartList charts={deduped} />
      </div>

      {/* Desktop */}
      <div className="hidden sm:block">
        <DataTable columns={columns} data={deduped} showResultsCount={false} />
      </div>
    </div>
  );
}
