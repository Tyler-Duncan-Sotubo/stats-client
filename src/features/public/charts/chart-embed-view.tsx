// features/public/charts/chart-embed-view.tsx
import Image from "next/image";
import { TrendBadge } from "@/shared/ui/chart-entry-row";
import { CHART_LABELS } from "@/lib/constants/charts";
import { toTitleCase } from "@/shared/utils/format";
import type { ChartResponse } from "@/lib/api/public";

interface Props {
  data: ChartResponse | null;
  chartName: string;
  territory: string;
}

const BASE_URL = "https://tooxclusive.com/stats";

export function ChartEmbedView({ data, chartName, territory }: Props) {
  const chartLabel = CHART_LABELS[chartName] ?? chartName.replace(/_/g, " ");

  if (!data || !data.data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No chart data available
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-foreground">{chartLabel}</p>
          {data.chartWeek && (
            <p className="text-xs text-muted-foreground/60">
              {new Date(data.chartWeek).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        <a
          href={`${BASE_URL}/charts/${chartName}/${territory}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline shrink-0"
        >
          Full chart →
        </a>
      </div>

      {/* Entries */}
      {data.data.slice(0, 10).map((entry, i) => {
        const img = entry.songImageUrl ?? entry.artistImageUrl;
        return (
          <div
            key={entry.entryId}
            className={`flex items-center gap-3 px-4 py-3 ${
              i !== 0 ? "border-t border-border" : ""
            }`}
          >
            {/* Position + trend */}
            <div className="flex flex-col items-center shrink-0 w-7">
              <span className="text-sm font-mono font-bold tabular-nums text-foreground">
                {entry.position}
              </span>
              <TrendBadge trend={entry.trend} delta={entry.delta} />
            </div>

            {/* Image */}
            <div className="relative w-9 h-9 shrink-0 overflow-hidden rounded-lg bg-muted">
              {img ? (
                <Image
                  src={img}
                  alt={entry.songTitle}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground/30">
                    {entry.songTitle[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Title + artist */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {toTitleCase(entry.songTitle)}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {toTitleCase(entry.artistName)}
              </p>
            </div>

            {/* Peak + weeks */}
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">
                Peak{" "}
                <span className="font-bold text-foreground">
                  {entry.peakPosition != null ? `#${entry.peakPosition}` : "—"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Wks{" "}
                <span className="font-bold text-foreground">
                  {entry.weeksOnChart ?? "—"}
                </span>
              </p>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border">
        <p className="text-xs text-muted-foreground/40">
          Powered by{" "}
          <a
            href={BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            TooXclusive Stats
          </a>
        </p>
      </div>
    </div>
  );
}
