// app/embed/charts/page.tsx
import { getChart } from "@/lib/api/public";
import { unstable_cache } from "next/cache";
import { toTitleCase } from "@/shared/utils/format";
import { ChartCard } from "@/features/public/embeds/chart-cards";

export const dynamic = "force-dynamic";

const getTooxChart = unstable_cache(
  () => getChart("tooxclusive_top_100", "NG", 10),
  ["embed-toox-chart"],
  { revalidate: 3600 },
);

const getSpotifyChart = unstable_cache(
  () => getChart("spotify_daily_ng", "NG", 1),
  ["embed-spotify-chart"],
  { revalidate: 3600 },
);

export default async function ChartsEmbedPage() {
  const [tooxRes, spotifyRes] = await Promise.all([
    getTooxChart().catch(() => null),
    getSpotifyChart().catch(() => null),
  ]);

  const toox = tooxRes?.data ?? [];
  const spotify = spotifyRes?.data ?? [];

  const tooxTop = toox.find((e) => e.position === 1);
  const spotifyTop = spotify[0] ?? null;

  const tooxArtists = toox
    .filter((e) => e.position <= 10)
    .map((e) => toTitleCase(e.artistName))
    .filter((n, i, a) => a.indexOf(n) === i)
    .slice(0, 2)
    .join(", ");

  const uniqueArtists = new Set(toox.map((e) => e.artistId)).size;

  const tooxDate = tooxTop?.chartWeek
    ? new Date(tooxTop.chartWeek).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Tooxclusive Afrobeats #1 */}
      <ChartCard
        platform="Tooxclusive Afrobeats"
        song={tooxTop ? toTitleCase(tooxTop.songTitle) : "—"}
        artist={tooxTop ? toTitleCase(tooxTop.artistName) : ""}
        meta={`${uniqueArtists} artists charting · Top 10: ${tooxArtists}...`}
        badge={tooxDate ? `Week of ${tooxDate}` : null}
        imageUrl={tooxTop?.artistImageUrl}
        href="/charts/tooxclusive_top_100/NG"
        bg="#0C1A2E"
        accent="#FFA500"
      />

      {/* Spotify Nigeria #1 */}
      <ChartCard
        platform="Spotify Nigeria"
        song={spotifyTop ? toTitleCase(spotifyTop.songTitle) : "—"}
        artist={spotifyTop ? toTitleCase(spotifyTop.artistName) : ""}
        meta="Daily chart · Nigeria"
        badge="Today"
        imageUrl={spotifyTop?.artistImageUrl}
        href="/charts/spotify_daily_ng/NG"
        bg="#1DB954"
        accent="rgba(255,255,255,0.9)"
      />
    </div>
  );
}
