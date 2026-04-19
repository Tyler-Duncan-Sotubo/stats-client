"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toTitleCase } from "@/shared/utils/format";

export function TrendBadge({
  trend,
  delta,
}: {
  trend: string | null;
  delta: number | null;
}) {
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
  return <Minus className="w-3 h-3 text-muted-foreground/40" />;
}

export function EntryImage({
  src,
  alt,
  size = 40,
  rounded = "rounded-lg",
}: {
  src?: string | null;
  alt: string;
  size?: number;
  rounded?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${rounded} bg-muted`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-xs font-bold text-muted-foreground/30">
            {alt[0]}
          </span>
        </div>
      )}
    </div>
  );
}

export function ChartEntryRow({
  position,
  trend,
  delta,
  songTitle,
  artistName,
  imageUrl,
  peakPosition,
  weeksOnChart,
  onClick,
  href,
  showStats = true,
  isFirst = false,
}: {
  position: number;
  trend?: string | null;
  delta?: number | null;
  songTitle: string;
  artistName: string;
  imageUrl?: string | null;
  peakPosition?: number | null;
  weeksOnChart?: number | null;
  onClick?: () => void;
  href?: string;
  showStats?: boolean;
  isFirst?: boolean;
}) {
  const formatWeeks = (days: number | null | undefined) => {
    if (!days) return "—";
    const weeks = Math.ceil(days / 7);
    return `${weeks} ${weeks === 1 ? "wk" : "wks"}`;
  };

  const inner = (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 ${
        !isFirst ? "border-t border-border" : ""
      } hover:bg-muted/30 transition-colors`}
    >
      {/* Position + trend */}
      <div className="flex flex-col items-center shrink-0 w-8">
        <span className="text-sm font-mono font-bold tabular-nums text-foreground">
          {position}
        </span>
        {trend !== undefined && (
          <TrendBadge trend={trend ?? null} delta={delta ?? null} />
        )}
      </div>

      {/* Image */}
      <EntryImage src={imageUrl} alt={songTitle} size={40} />

      {/* Title + artist */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground truncate">
          {toTitleCase(songTitle)}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {toTitleCase(artistName)}
        </p>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">
            Peak{" "}
            <span className="font-bold text-foreground">
              {peakPosition != null ? `#${peakPosition}` : "—"}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Wks{" "}
            <span className="font-bold text-foreground">
              {formatWeeks(weeksOnChart)}
            </span>
          </p>
        </div>
      )}
    </div>
  );

  // href takes priority over onClick
  if (href) {
    return (
      <Link href={href} className="block w-full">
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {inner}
      </button>
    );
  }

  return inner;
}
