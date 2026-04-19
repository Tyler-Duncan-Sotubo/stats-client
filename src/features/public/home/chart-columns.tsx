import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ChartEntry } from "@/lib/api/public";
import { toTitleCase } from "@/shared/utils/format";

export const chartColumns: ColumnDef<ChartEntry>[] = [
  {
    id: "position",
    header: "#",
    size: 40,
    cell: ({ row }) => (
      <span className="text-sm font-mono text-muted-foreground tabular-nums">
        {row.original.position}
      </span>
    ),
  },
  {
    id: "song",
    header: "Song",
    cell: ({ row }) => {
      const e = row.original;
      const img = e.songImageUrl ?? e.artistImageUrl;
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 shrink-0 rounded-md bg-muted overflow-hidden flex items-center justify-center">
            {img ? (
              <Image
                src={img}
                alt={e.songTitle}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs font-semibold text-muted-foreground">
                {toTitleCase(e.songTitle[0])}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
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
    id: "trend",
    header: "",
    size: 48,
    cell: ({ row }) => {
      const { trend, delta } = row.original;
      if (trend === "NEW") {
        return (
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            New
          </span>
        );
      }
      if (trend === "UP") {
        return (
          <span className="flex items-center gap-0.5 text-xs text-emerald-500 font-mono">
            <TrendingUp className="w-3 h-3" />
            {delta}
          </span>
        );
      }
      if (trend === "DOWN") {
        return (
          <span className="flex items-center gap-0.5 text-xs text-rose-500 font-mono">
            <TrendingDown className="w-3 h-3" />
            {delta}
          </span>
        );
      }
      return <Minus className="w-4 h-4 text-black font-bold" />;
    },
  },
];
