import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import type { TrendingArtist } from "@/lib/api/public";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const artistColumns: ColumnDef<TrendingArtist>[] = [
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
    id: "artist",
    header: "Artist",
    cell: ({ row }) => {
      const a = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 shrink-0 rounded-full bg-muted overflow-hidden flex items-center justify-center">
            {a.imageUrl ? (
              <Image
                src={a.imageUrl}
                alt={a.name}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">
                {a.name[0]}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {a.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {[
                a.originCountry,
                a.monthlyListeners
                  ? `${formatNumber(a.monthlyListeners)} listeners`
                  : null,
              ]
                .filter(Boolean)
                .join(" · ")}
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
      const a = row.original;
      const g = a.dailyGrowth ?? 0;
      const isUp = g > 0;
      return (
        <div className="text-right">
          <p className="text-sm font-mono tabular-nums">
            {a.dailyStreams ? formatNumber(a.dailyStreams) : "—"}
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
