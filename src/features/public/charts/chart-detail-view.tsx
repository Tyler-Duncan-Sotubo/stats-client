// features/charts/chart-detail-view.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { DataTable } from "@/shared/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ChartResponse, ChartEntry } from "@/lib/api/public";
import { ChevronLeft } from "lucide-react";
import { toTitleCase } from "@/shared/utils/format";
import { CHART_LABELS } from "@/lib/constants/charts";
import {
  TrendBadge,
  EntryImage,
  ChartEntryRow,
} from "@/shared/ui/chart-entry-row";

function formatWeeks(days: number | null): string {
  if (!days) return "—";
  const weeks = Math.ceil(days / 7);
  return `${weeks} ${weeks === 1 ? "wk" : "wks"}`;
}

const columns: ColumnDef<ChartEntry>[] = [
  {
    id: "position",
    header: "#",
    size: 50,
    cell: ({ row }) => (
      <span className="text-sm font-mono font-bold tabular-nums text-foreground">
        {row.original.position}
      </span>
    ),
  },
  {
    id: "trend",
    header: "",
    size: 40,
    cell: ({ row }) => (
      <TrendBadge trend={row.original.trend} delta={row.original.delta} />
    ),
  },
  {
    id: "song",
    header: "Song",
    cell: ({ row }) => {
      const e = row.original;
      const img = e.songImageUrl ?? e.artistImageUrl; // ← fallback
      return (
        <div className="flex items-center gap-3">
          <EntryImage src={img} alt={e.songTitle} size={40} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {toTitleCase(e.songTitle)}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {toTitleCase(e.artistName)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "peak",
    header: "Peak",
    size: 70,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {row.original.peakPosition ? `#${row.original.peakPosition}` : "—"}
      </span>
    ),
  },
  {
    id: "weeks",
    header: "Weeks",
    size: 70,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {formatWeeks(row.original.weeksOnChart)}
      </span>
    ),
  },
];

export function ChartDetailView({ data }: { data: ChartResponse }) {
  const router = useRouter();
  const chartLabel = CHART_LABELS[data.chartName] ?? data.chartName;

  const handleRowClick = (e: ChartEntry) => {
    if (e.songSlug) router.push(`/songs/${e.songSlug}`);
  };

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_350px] gap-6">
      <div className="pb-16 max-w-4xl">
        <Link
          href="/charts"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          All Charts
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {chartLabel}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.chartTerritory}
            {data.chartWeek && (
              <>
                {" "}
                · Week of{" "}
                {new Date(data.chartWeek).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </>
            )}{" "}
            · {data.meta.total} entries
          </p>
        </div>

        {/* Mobile */}
        <div className="sm:hidden">
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            {data.data.map((e, i) => (
              <ChartEntryRow
                key={e.entryId}
                position={e.position}
                trend={e.trend}
                delta={e.delta}
                songTitle={e.songTitle}
                artistName={e.artistName}
                imageUrl={e.songImageUrl ?? e.artistImageUrl}
                peakPosition={e.peakPosition}
                weeksOnChart={e.weeksOnChart}
                onClick={() => handleRowClick(e)}
                isFirst={i === 0}
              />
            ))}
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden sm:block">
          <DataTable
            columns={columns}
            data={data.data}
            onRowClick={handleRowClick}
            showResultsCount={false}
          />
        </div>
      </div>
      <div className="mt-16"></div>
    </section>
  );
}
