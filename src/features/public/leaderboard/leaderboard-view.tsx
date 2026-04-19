"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { LeaderboardResponse } from "@/lib/api/public";
import { LeaderboardTabs } from "./leaderboard-tabs";
import { LeaderboardFilters } from "./leaderboard-filters";
import { LeaderboardPodium } from "./leaderboard-podium";
import { LeaderboardTable } from "./leaderboard-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LeaderboardViewProps {
  streams: LeaderboardResponse;
  listeners: LeaderboardResponse;
  songs: LeaderboardResponse;
  currentTab: string;
  currentCountry?: string;
  currentPage: number;
}

export function LeaderboardView({
  streams,
  listeners,
  songs,
  currentTab,
  currentCountry,
  currentPage,
}: LeaderboardViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  }

  const activeData =
    currentTab === "streams"
      ? streams
      : currentTab === "listeners"
        ? listeners
        : songs;

  const totalPages = Math.ceil((activeData.meta.total ?? 0) / 50);

  // tab config
  const tabConfig = {
    streams: {
      valueKey: "totalStreams" as const,
      secondaryKey: "dailyStreams" as const,
      labelKey: "artistName" as const,
      slugKey: "artistSlug" as const,
      imageKey: "artistImageUrl" as const,
      hrefPrefix: "/artists" as const,
      valueLabel: "Total Streams",
      secondaryLabel: "Daily",
    },
    listeners: {
      valueKey: "monthlyListeners" as const,
      secondaryKey: "dailyChange" as const,
      labelKey: "artistName" as const,
      slugKey: "artistSlug" as const,
      imageKey: "artistImageUrl" as const,
      hrefPrefix: "/artists" as const,
      valueLabel: "Monthly Listeners",
      secondaryLabel: "Change",
    },
    songs: {
      valueKey: "totalStreams" as const,
      secondaryKey: "dailyStreams" as const,
      labelKey: "songTitle" as const,
      slugKey: "songSlug" as const,
      imageKey: "artistImageUrl" as const,
      hrefPrefix: "/songs" as const,
      valueLabel: "Total Streams",
      secondaryLabel: "Daily",
    },
  };

  const config =
    tabConfig[currentTab as keyof typeof tabConfig] ?? tabConfig.streams;
  const isFirstPage = currentPage === 1;

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Leaderboards
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Rankings updated daily · Spotify streams only
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <LeaderboardTabs currentTab={currentTab} />
        <LeaderboardFilters
          currentTab={currentTab}
          currentCountry={currentCountry}
        />
      </div>

      {/* Podium — only on page 1 */}
      {isFirstPage && (
        <LeaderboardPodium
          entries={activeData.data}
          valueKey={config.valueKey}
          labelKey={config.labelKey}
          slugKey={config.slugKey}
          imageKey={config.imageKey}
          hrefPrefix={config.hrefPrefix}
          valueLabel={config.valueLabel}
        />
      )}

      {/* Stats summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted-foreground">
          {activeData.meta.total?.toLocaleString()} total entries
          {currentCountry && ` in ${currentCountry}`}
        </p>
        <p className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Table */}
      <LeaderboardTable
        entries={activeData.data}
        valueKey={config.valueKey}
        secondaryKey={config.secondaryKey}
        labelKey={config.labelKey}
        slugKey={config.slugKey}
        imageKey={config.imageKey}
        hrefPrefix={config.hrefPrefix}
        valueLabel={config.valueLabel}
        secondaryLabel={config.secondaryLabel}
        startRank={isFirstPage ? 4 : 1}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => goToPage(currentPage - 1)}
            className="flex items-center justify-center rounded-lg border border-border h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`rounded-lg h-8 min-w-[32px] px-2 text-xs font-semibold transition-all ${
                  currentPage === p
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ),
          )}

          {totalPages > 7 && (
            <>
              <span className="text-muted-foreground text-xs px-1">…</span>
              <button
                onClick={() => goToPage(totalPages)}
                className={`rounded-lg h-8 min-w-[32px] px-2 text-xs font-semibold transition-all ${
                  currentPage === totalPages
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="flex items-center justify-center rounded-lg border border-border h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
