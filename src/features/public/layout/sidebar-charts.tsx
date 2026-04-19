"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SidebarLink } from "./sidebar-link";
import type { AvailableChart } from "@/lib/api/public";

const OVERRIDES: Record<string, string> = {
  spotify_daily_ng: "Spotify Nigeria",
  spotify_daily_global: "Spotify Global", // ← new
  spotify_daily_gb: "Spotify UK", // ← new
  tooxclusive_top_100: "TooXclusive Top 100",
  official_afrobeats_chart: "UK Afrobeats",
  billboard_hot_100: "Billboard Hot 100",
};

const FEATURED = Object.keys(OVERRIDES);

function formatChartName(chartName: string): string {
  return (
    OVERRIDES[chartName] ??
    chartName
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}

export function SidebarCharts({ charts }: { charts: AvailableChart[] }) {
  const [open, setOpen] = useState(true);

  const featured = charts.filter((c) => FEATURED.includes(c.chartName));

  if (!featured.length) return null;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-2 py-1 mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-muted-foreground transition-colors"
      >
        Charts
        {open ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>

      {open && (
        <div className="space-y-0.5">
          {featured.map((c) => (
            <SidebarLink
              key={`${c.chartName}-${c.chartTerritory}`}
              href={`/charts/${c.chartName}/${c.chartTerritory}`}
            >
              {formatChartName(c.chartName)}
            </SidebarLink>
          ))}
        </div>
      )}
    </div>
  );
}
