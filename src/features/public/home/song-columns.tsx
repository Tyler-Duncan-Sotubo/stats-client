import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import type { TrendingSong } from "@/lib/api/public";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const songColumns: ColumnDef<TrendingSong>[] = [
  {
    id: "rank",
    header: "#",
    size: 48,
    cell: ({ row }) => (
      <span className="text-sm font-mono text-muted-foreground tabular-nums">
        {row.index + 1}
      </span>
    ),
  },
  {
    id: "song",
    header: "Song",
    cell: ({ row }) => {
      const s = row.original;
      const img = s.imageUrl ?? s.artistImageUrl;
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 shrink-0 rounded-md bg-muted overflow-hidden flex items-center justify-center">
            {img ? (
              <Image
                src={img}
                alt={s.title}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">
                {s.title[0]}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {s.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {s.artistName ?? "—"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "dailyStreams",
    header: () => <span className="w-full text-right block">Daily</span>,
    size: 100,
    cell: ({ row }) => {
      const s = row.original;
      const g = s.dailyGrowth ?? 0;
      const isUp = g > 0;
      return (
        <div className="text-right">
          <p className="text-sm font-mono tabular-nums">
            {s.dailyStreams ? formatNumber(s.dailyStreams) : "—"}
          </p>
          {g !== 0 && (
            <span
              className={`flex items-center justify-end gap-0.5 text-xs font-mono tabular-nums ${
                isUp ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {isUp ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {isUp ? "+" : ""}
              {formatNumber(g)}
            </span>
          )}
          {g === 0 && (
            <span className="flex items-center justify-end text-xs text-muted-foreground">
              <Minus className="w-3 h-3" />
            </span>
          )}
        </div>
      );
    },
  },
];
