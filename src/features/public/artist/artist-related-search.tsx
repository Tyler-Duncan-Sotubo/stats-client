import Link from "next/link";
import type { PublicArtist } from "@/lib/api/public";
import { getChartLabel } from "@/lib/constants/charts";
import { getCountryName } from "@/shared/utils/get-country-name";
import { Search, ChevronRight } from "lucide-react";

interface RelatedSearch {
  label: string;
  href: string;
}

function buildRelatedSearches(artist: PublicArtist): RelatedSearch[] {
  const searches: RelatedSearch[] = [];

  if (artist.originCountry) {
    const countryName = getCountryName(artist.originCountry);
    searches.push({
      label: `${countryName} artists`,
      href: `/artists?country=${artist.originCountry}`,
    });
  }

  if (artist.isAfrobeats) {
    searches.push({
      label: "Afrobeats artists",
      href: "/artists?isAfrobeats=true",
    });
  }

  const primaryCharts = artist.charts
    .filter((c) => c.role === "primary" && c.bestPeakPosition)
    .sort((a, b) => (a.bestPeakPosition ?? 999) - (b.bestPeakPosition ?? 999))
    .slice(0, 2);

  for (const chart of primaryCharts) {
    searches.push({
      label: getChartLabel(chart.chartName),
      href: `/charts/${chart.chartName}/${chart.chartTerritory}`,
    });
  }

  searches.push({
    label: "Most streamed artists",
    href: "/leaderboard?tab=streams",
  });

  if (artist.slug) {
    searches.push({
      label: `Compare ${artist.name}`,
      href: `/compare?left=${artist.slug}`,
    });
  }

  return searches;
}

export function ArtistRelatedSearches({ artist }: { artist: PublicArtist }) {
  const searches = buildRelatedSearches(artist);

  if (!searches.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Related Searches
      </h2>
      <div className="rounded-xl border border-border bg-card overflow-hidden px-2 py-1">
        {searches.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg group"
          >
            <Search className="w-4 h-4 shrink-0 text-primary" />
            <span className="text-base text-primary font-medium flex-1 group-hover:underline">
              {s.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
