"use client";

import type { SongChart } from "@/lib/api/public";
import { CHART_LABELS } from "@/lib/constants/charts";
import { DataTable } from "@/shared/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<SongChart>[] = [
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
            {c.chartTerritory}
            {c.firstCharted && (
              <> · Since {new Date(c.firstCharted).getFullYear()}</>
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
        #{row.original.peakPosition ?? "—"}
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

export function SongCharts({ charts }: { charts: SongChart[] }) {
  if (!charts.length) return null;

  const sorted = [...charts].sort(
    (a, b) => (a.peakPosition ?? 999) - (b.peakPosition ?? 999),
  );

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Chart History
      </h2>
      <DataTable columns={columns} data={sorted} showResultsCount={false} />
    </div>
  );
}
