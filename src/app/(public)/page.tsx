import {
  getTrendingArtists,
  getTrendingSongs,
  getChart,
  getStreamLeaderboard,
  getListenerLeaderboard,
  getArtist,
  type PublicArtist,
} from "@/lib/api/public";
import { HomeView } from "@/features/public/home/home-view";
import type { Metadata } from "next";
import {
  ChartSchema,
  OrganizationSchema,
  TrendingArtistsSchema,
  WebsiteSchema,
} from "@/features/seo/schema";

export const metadata: Metadata = {
  title: "TooXclusive Stats — African Music Charts, Streams & Leaderboards",
  description:
    "Track Afrobeats and African music charts, streaming stats, artist leaderboards and chart history. Powered by TooXclusive.",
  keywords: [
    "Afrobeats charts",
    "Nigerian music charts",
    "African music streaming stats",
    "Wizkid streams",
    "Burna Boy charts",
    "TooXclusive stats",
    "Spotify Nigeria charts",
    "Apple Music Nigeria",
  ],
  openGraph: {
    title: "TooXclusive Stats — African Music Charts & Leaderboards",
    description:
      "Track Afrobeats and African music charts, streaming stats and artist leaderboards.",
    url: "https://tooxclusive.com/stats",
    siteName: "TooXclusive Stats",
    type: "website",
    images: [
      {
        url: "https://tooxclusive.com/stats/og-image.png",
        width: 1200,
        height: 630,
        alt: "TooXclusive Stats",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tooxclusive",
    title: "TooXclusive Stats — African Music Charts & Leaderboards",
    description:
      "Track Afrobeats and African music charts, streaming stats and artist leaderboards.",
    images: ["https://tooxclusive.com/stats/og-image.png"],
  },
  alternates: {
    canonical: "https://tooxclusive.com/stats",
  },
};

export default async function HomePage() {
  const [
    songsRes,
    tooxRes,
    globalArtistsRes,
    streamsRes,
    listenersRes,
    wizkidRes,
    davidoRes,
    burnaRes,
  ] = await Promise.allSettled([
    getTrendingSongs({ limit: 20, isAfrobeats: true }),
    getChart("tooxclusive_top_100", "NG", 20),
    getTrendingArtists({ limit: 20 }),
    getStreamLeaderboard({ limit: 1, country: "NG" }),
    getListenerLeaderboard({ limit: 10, country: "NG" }),
    getArtist("wizkid"),
    getArtist("davido"),
    getArtist("burna-boy"),
  ]);

  const featuredArtists = [wizkidRes, davidoRes, burnaRes]
    .filter((r) => r.status === "fulfilled")
    .map((r) => (r as PromiseFulfilledResult<PublicArtist>).value);

  const seed = new Date().toISOString().slice(0, 10);
  const seededIndex =
    parseInt(seed.replace(/-/g, ""), 10) % featuredArtists.length;
  const shuffled = [
    ...featuredArtists.slice(seededIndex),
    ...featuredArtists.slice(0, seededIndex),
  ].slice(0, 2);

  const listenersData =
    listenersRes.status === "fulfilled" ? listenersRes.value : null;
  const topListenerArtist = listenersData?.data?.[0] ?? null;
  const ngListeners = listenersData?.data ?? [];

  const tooxEntries = tooxRes.status === "fulfilled" ? tooxRes.value.data : [];
  const globalArtists =
    globalArtistsRes.status === "fulfilled" ? globalArtistsRes.value.data : [];

  return (
    <>
      <WebsiteSchema />
      <OrganizationSchema />
      <ChartSchema entries={tooxEntries} />
      <TrendingArtistsSchema artists={globalArtists} />
      <HomeView
        songs={songsRes.status === "fulfilled" ? songsRes.value.data : []}
        snapshotDate={
          songsRes.status === "fulfilled"
            ? songsRes.value.meta.snapshotDate
            : null
        }
        tooxclusive={tooxEntries}
        globalArtists={globalArtists}
        topStreamedArtist={
          streamsRes.status === "fulfilled"
            ? (streamsRes.value.data[0] ?? null)
            : null
        }
        topListenerArtist={topListenerArtist}
        featuredArtists={shuffled}
        ngListeners={ngListeners}
      />
    </>
  );
}
