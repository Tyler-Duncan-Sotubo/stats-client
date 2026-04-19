"use client";

import Image from "next/image";
import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/api/public";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toTitleCase, formatNumber } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";
import getFlagEmoji from "country-flag-icons/unicode";
import { hasFlag } from "country-flag-icons";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  valueKey: "totalStreams" | "monthlyListeners";
  secondaryKey?: "dailyStreams" | "dailyChange";
  labelKey: "artistName" | "songTitle";
  slugKey: "artistSlug" | "songSlug";
  imageKey: "artistImageUrl" | "songImageUrl";
  hrefPrefix: "/artists" | "/songs";
  valueLabel: string;
  secondaryLabel?: string;
  startRank?: number;
}

export function LeaderboardTable({
  entries,
  valueKey,
  secondaryKey,
  labelKey,
  slugKey,
  imageKey,
  hrefPrefix,
  valueLabel,
  secondaryLabel,
  startRank = 4,
}: LeaderboardTableProps) {
  const tableEntries = entries.slice(startRank - 1);

  if (!tableEntries.length) return null;

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {/* Header */}
      <div
        className={`grid gap-3 px-4 py-3 bg-muted/50 border-b border-border ${
          secondaryLabel
            ? "grid-cols-[36px_1fr_80px_80px] sm:grid-cols-[48px_1fr_140px_140px]"
            : "grid-cols-[36px_1fr_80px] sm:grid-cols-[48px_1fr_140px]"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          #
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Artist
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-right">
          {valueLabel}
        </p>
        {secondaryLabel && (
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground text-right">
            {secondaryLabel}
          </p>
        )}
      </div>

      {tableEntries.map((entry, i) => {
        const name = entry[labelKey] as string;
        const slug = entry[slugKey] as string | null;
        const imageUrl = entry[imageKey] as string | null;
        const value = entry[valueKey] as number | null;
        const secondary = secondaryKey
          ? (entry[secondaryKey] as number | null)
          : null;
        const rank = entry.rank;

        return (
          <Link
            key={`${rank}-${name}`}
            href={slug ? `${hrefPrefix}/${slug}` : "#"}
            className={`grid gap-3 items-center px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
              secondaryLabel
                ? "grid-cols-[36px_1fr_80px_80px] sm:grid-cols-[48px_1fr_140px_140px]"
                : "grid-cols-[36px_1fr_80px] sm:grid-cols-[48px_1fr_140px]"
            }`}
          >
            {/* Rank */}
            <span
              className={`text-sm font-black tabular-nums ${
                rank === 1
                  ? "text-amber-400"
                  : rank === 2
                    ? "text-slate-400"
                    : rank === 3
                      ? "text-orange-400"
                      : "text-muted-foreground"
              }`}
            >
              {rank}
            </span>

            {/* Artist/Song */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm font-bold text-muted-foreground/30">
                      {name?.[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate leading-tight">
                  {toTitleCase(name)}
                </p>
                {entry.originCountry && (
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                    <span className="sm:hidden">
                      {hasFlag(entry.originCountry.toUpperCase())
                        ? getFlagEmoji(entry.originCountry.toUpperCase())
                        : entry.originCountry.toUpperCase()}{" "}
                      <span className="text-[10px]">
                        {entry.originCountry.toUpperCase()}
                      </span>
                    </span>
                    <span className="hidden sm:inline">
                      {getCountryName(entry.originCountry)}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Value */}
            <p className="text-sm font-bold tabular-nums text-foreground text-right">
              {value ? formatNumber(value) : "—"}
            </p>

            {/* Secondary */}
            {secondaryLabel && (
              <div className="text-right">
                {secondary !== null && secondary !== undefined ? (
                  <div className="flex items-center justify-end gap-1">
                    {secondaryKey === "dailyChange" ? (
                      secondary > 0 ? (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                      ) : secondary < 0 ? (
                        <TrendingDown className="w-3 h-3 text-rose-500" />
                      ) : (
                        <Minus className="w-3 h-3 text-muted-foreground/40" />
                      )
                    ) : null}
                    <p
                      className={`text-sm font-medium tabular-nums ${
                        secondaryKey === "dailyChange"
                          ? secondary > 0
                            ? "text-emerald-500"
                            : secondary < 0
                              ? "text-rose-500"
                              : "text-muted-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {secondaryKey === "dailyChange" && secondary > 0
                        ? "+"
                        : ""}
                      {formatNumber(Math.abs(secondary))}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
