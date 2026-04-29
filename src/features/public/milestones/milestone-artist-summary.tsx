// milestone-artist-summary.tsx

import Link from "next/link";
import { formatNumber } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";
import type { MilestoneArtistResponse } from "@/lib/api/public";

interface Props {
  data: MilestoneArtistResponse["data"];
  meta: MilestoneArtistResponse["meta"];
  label: string;
  isAfrobeats?: boolean;
}

export function MilestoneArtistSummary({
  data,
  meta,
  label,
  isAfrobeats,
}: Props) {
  const topArtist = data[0];

  const topCountries = [
    ...new Map(
      data.filter((a) => a.originCountry).map((a) => [a.originCountry, a]),
    ).values(),
  ]
    .slice(0, 3)
    .map((a) => getCountryName(a.originCountry!));

  return (
    <div className="rounded-xl border border-border bg-muted/20 px-5 py-4 mb-8">
      <p className="text-base text-foreground leading-relaxed">
        This page tracks every {isAfrobeats ? "Afrobeats artist" : "artist"} on
        Spotify that has surpassed <strong>{label} streams</strong> — currently{" "}
        <strong>{formatNumber(meta.total)} artists</strong> in total. The
        most-streamed artist in this tier is{" "}
        <Link
          href={topArtist.artistSlug ? `/artists/${topArtist.artistSlug}` : "#"}
          className="font-semibold text-primary hover:underline"
        >
          {topArtist.artistName}
        </Link>
        {topArtist.originCountry && (
          <>
            {" "}
            from <strong>{getCountryName(topArtist.originCountry)}</strong>
          </>
        )}{" "}
        with{" "}
        <strong>{formatNumber(topArtist.totalStreams)} total streams</strong>.
        {topCountries.length > 0 && (
          <>
            {" "}
            Top represented countries in this milestone include{" "}
            {topCountries.map((country, i) => (
              <span key={country}>
                <strong>{country}</strong>
                {i < topCountries.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </>
        )}{" "}
        Data is refreshed daily.
      </p>
    </div>
  );
}
