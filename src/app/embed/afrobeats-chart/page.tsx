import { getChart } from "@/lib/api/public";
import { unstable_cache } from "next/cache";
import {
  EmbedAfrobeatsCard,
  EmbedSpotifyCard,
} from "@/features/public/embeds/embed-stat-card";

export const dynamic = "force-dynamic";

const getTooxChart = unstable_cache(
  () => getChart("tooxclusive_top_100", "NG", 20),
  ["embed-toox-chart"],
  { revalidate: 3600 },
);

const getSpotifyChart = unstable_cache(
  () => getChart("spotify_daily_ng", "NG", 1),
  ["embed-spotify-chart"],
  { revalidate: 3600 },
);

export default async function AfrobeatsChartEmbedPage() {
  const [tooxRes, spotifyRes] = await Promise.all([
    getTooxChart().catch(() => null),
    getSpotifyChart().catch(() => null),
  ]);

  const chart = tooxRes?.data ?? [];
  const spotifyEntries = spotifyRes?.data ?? [];

  return (
    <div className="space-y-4">
      <EmbedAfrobeatsCard tooxclusive={chart} />
      <EmbedSpotifyCard spotify={spotifyEntries} />
    </div>
  );
}
