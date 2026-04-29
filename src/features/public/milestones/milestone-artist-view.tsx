import Link from "next/link";
import Image from "next/image";
import { formatNumber } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";
import { MilestonePagination } from "./milestone-pagination";
import type { MilestoneArtistResponse } from "@/lib/api/public";
import { MilestoneArtistSummary } from "./milestone-artist-summary";

interface Props {
  result: MilestoneArtistResponse;
  tier: string;
  label: string;
  isAfrobeats?: boolean;
}

export function MilestoneArtistView({
  result,
  tier,
  label,
  isAfrobeats,
}: Props) {
  const { data, meta } = result;
  const baseHref = isAfrobeats
    ? `/milestones/afrobeats/artists/${tier}`
    : `/milestones/artists/${tier}`;

  return (
    <div className="pb-16 max-w-5xl">
      <div className="mb-8">
        <Link
          href="/milestones"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          ← Milestones
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          {isAfrobeats ? "Afrobeats Artists" : "Artists"} with {label}+ Spotify
          Streams
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatNumber(meta.total)} artists · Page {meta.page} of{" "}
          {meta.totalPages}
        </p>
      </div>

      <MilestoneArtistSummary
        data={data}
        meta={meta}
        label={label}
        isAfrobeats={isAfrobeats}
      />

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-12">
                #
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Artist
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">
                Total Streams
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                Daily
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((artist) => (
              <tr
                key={artist.artistId}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground text-right">
                  {artist.rank}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={
                      artist.artistSlug ? `/artists/${artist.artistSlug}` : "#"
                    }
                    className="flex items-center gap-3 hover:text-primary transition-colors"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0">
                      {artist.imageUrl ? (
                        <Image
                          src={artist.imageUrl}
                          alt={artist.artistName}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground/30">
                          {artist.artistName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {artist.artistName}
                      </p>
                      {artist.originCountry && (
                        <p className="text-xs text-muted-foreground">
                          {getCountryName(artist.originCountry)}
                        </p>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                  {formatNumber(artist.totalStreams)}
                </td>
                <td className="px-4 py-3 text-right text-xs tabular-nums text-muted-foreground hidden sm:table-cell">
                  {artist.dailyStreams
                    ? `+${formatNumber(artist.dailyStreams)}`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MilestonePagination
        page={meta.page}
        totalPages={meta.totalPages}
        baseHref={baseHref}
      />
    </div>
  );
}
