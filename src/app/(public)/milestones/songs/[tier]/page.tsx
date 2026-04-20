import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSongMilestone } from "@/lib/api/public";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { MilestonePagination } from "@/features/public/milestones/milestone-pagination";

const BASE_URL = "https://tooxclusive.com/stats";

const TIER_LABELS: Record<string, string> = {
  "100-million-streams": "100 Million",
  "500-million-streams": "500 Million",
  "1-billion-streams": "1 Billion",
};

interface Props {
  params: Promise<{ tier: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tier } = await params;
  const label = TIER_LABELS[tier];
  if (!label) return {};

  const title = `Songs with ${label}+ Spotify Streams — TooXclusive Stats`;
  const description = `Every song on Spotify with over ${label} streams. Updated daily.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/milestones/songs/${tier}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/milestones/songs/${tier}`,
      siteName: "TooXclusive Stats",
      type: "website",
    },
  };
}

export default async function SongMilestonePage({
  params,
  searchParams,
}: Props) {
  const { tier } = await params;
  const { page: pageParam } = await searchParams;
  const label = TIER_LABELS[tier];

  if (!label) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1"));

  const result = await getSongMilestone({ tier, page, limit: 50 }).catch(
    () => null,
  );
  if (!result) notFound();

  const { data, meta } = result;

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
          Songs with {label}+ Spotify Streams
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatNumber(meta.total)} songs · Page {meta.page} of{" "}
          {meta.totalPages}
        </p>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-12">
                #
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">
                Song
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
            {data.map((song) => (
              <tr
                key={song.songId}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-xs font-mono text-muted-foreground text-right">
                  {song.rank}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={song.songSlug ? `/songs/${song.songSlug}` : "#"}
                    className="flex items-center gap-3 hover:text-primary transition-colors"
                  >
                    <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0">
                      {song.imageUrl ? (
                        <Image
                          src={song.imageUrl}
                          alt={song.songTitle}
                          fill
                          sizes="32px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground/30">
                          {song.songTitle[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {toTitleCase(song.songTitle)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {song.artistName}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">
                  {formatNumber(song.totalStreams)}
                </td>
                <td className="px-4 py-3 text-right text-xs tabular-nums text-muted-foreground hidden sm:table-cell">
                  {song.dailyStreams
                    ? `+${formatNumber(song.dailyStreams)}`
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
        baseHref={`/milestones/songs/${tier}`}
      />
    </div>
  );
}
