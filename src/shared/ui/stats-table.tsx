"use client";

import Image from "next/image";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface StatsTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T, index: number) => React.ReactNode;
}

export interface StatsTableProps<T> {
  data: T[];
  columns: StatsTableColumn<T>[];
  getKey: (row: T) => string;
  getHref?: (row: T) => string | null;
  emptyMessage?: string;
}

export function StatsTable<T>({
  data,
  columns,
  getKey,
  getHref,
  emptyMessage = "No data available",
}: StatsTableProps<T>) {
  if (!data.length) {
    return (
      <div className="px-3 py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div
        className="grid px-3 pb-2 border-b border-border"
        style={{
          gridTemplateColumns: columns
            .map((c) => c.className ?? "1fr")
            .join(" "),
        }}
      >
        {columns.map((col) => (
          <span
            key={col.key}
            className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            {col.header}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className="space-y-0.5 mt-1">
        {data.map((row, index) => {
          const href = getHref?.(row);
          const inner = (
            <div
              className="grid px-3 py-2 rounded-lg hover:bg-accent transition-colors group cursor-pointer"
              style={{
                gridTemplateColumns: columns
                  .map((c) => c.className ?? "1fr")
                  .join(" "),
              }}
            >
              {columns.map((col) => (
                <div key={col.key} className="flex items-center">
                  {col.render(row, index)}
                </div>
              ))}
            </div>
          );

          return href ? (
            <Link key={getKey(row)} href={href}>
              {inner}
            </Link>
          ) : (
            <div key={getKey(row)}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

// ── Reusable cell primitives ──────────────────────────────────────────────────

export function RankCell({ rank }: { rank: number }) {
  return (
    <span className="text-sm font-mono text-muted-foreground tabular-nums w-full text-right pr-2">
      {rank}
    </span>
  );
}

export function AvatarCell({
  src,
  alt,
  fallback,
  round = false,
}: {
  src?: string | null;
  alt: string;
  fallback: string;
  round?: boolean;
}) {
  return (
    <div
      className={`w-8 h-8 shrink-0 bg-muted overflow-hidden flex items-center justify-center ${
        round ? "rounded-full" : "rounded-md"
      }`}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="text-xs font-semibold text-muted-foreground">
          {fallback}
        </span>
      )}
    </div>
  );
}

export function LabelCell({
  primary,
  secondary,
}: {
  primary: string;
  secondary?: string | null;
}) {
  return (
    <div className="min-w-0 flex flex-col">
      <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
        {primary}
      </span>
      {secondary && (
        <span className="text-xs text-muted-foreground truncate">
          {secondary}
        </span>
      )}
    </div>
  );
}

export function NumberCell({
  value,
  growth,
}: {
  value: number | null | undefined;
  growth?: number | null;
}) {
  const g = growth ?? 0;
  const isUp = g > 0;
  const isDown = g < 0;

  return (
    <div className="text-right w-full">
      <p className="text-sm font-mono text-foreground tabular-nums">
        {value != null ? formatNumber(value) : "—"}
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
      {g === 0 && growth !== undefined && (
        <span className="flex items-center justify-end text-xs text-muted-foreground">
          <Minus className="w-3 h-3" />
        </span>
      )}
    </div>
  );
}

export function TrendCell({ trend }: { trend: string | null }) {
  if (!trend) return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;

  if (trend === "UP")
    return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === "DOWN")
    return <TrendingDown className="w-3.5 h-3.5 text-rose-500" />;
  if (trend === "NEW")
    return (
      <span className="text-xs font-semibold text-primary uppercase">New</span>
    );

  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

// ── Utility ───────────────────────────────────────────────────────────────────

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
