import {
  getStreamLeaderboard,
  getListenerLeaderboard,
  getSongLeaderboard,
} from "@/lib/api/public";
import { LeaderboardView } from "@/features/public/leaderboard/leaderboard-view";
import type { Metadata } from "next";
import Script from "next/script";
import type { LeaderboardEntry } from "@/lib/api/public";
import { getCountryName } from "@/shared/utils/get-country-name";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  searchParams: Promise<{
    tab?: string;
    country?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const tab = params.tab ?? "streams";
  const country = params.country;

  const tabLabels: Record<string, string> = {
    streams: "Most Streamed Artists",
    listeners: "Most Monthly Listeners",
    songs: "Most Streamed Songs",
  };

  const label = tabLabels[tab] ?? "Leaderboards";
  const countryLabel = country
    ? ` in ${getCountryName(country) ?? country}`
    : "";

  return {
    title: `${label}${countryLabel} — TooXclusive Stats`,
    description: `Ranked leaderboard of ${label.toLowerCase()}${countryLabel}. Discover the biggest African and Afrobeats artists by streaming numbers.`,
    openGraph: {
      title: `${label}${countryLabel} — TooXclusive Stats`,
      description: `Ranked leaderboard of ${label.toLowerCase()}${countryLabel}.`,
      url: `${BASE_URL}/leaderboard?tab=${tab}${country ? `&country=${country}` : ""}`,
      siteName: "TooXclusive Stats",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@tooxclusive",
      title: `${label}${countryLabel} — TooXclusive Stats`,
      description: `Ranked leaderboard of ${label.toLowerCase()}${countryLabel}.`,
    },
    alternates: {
      canonical: `${BASE_URL}/leaderboard?tab=${tab}${country ? `&country=${country}` : ""}`,
    },
  };
}

function LeaderboardSchema({
  tab,
  entries,
  country,
}: {
  tab: string;
  entries: LeaderboardEntry[];
  country?: string;
}) {
  if (!entries.length) return null;

  const tabLabels: Record<string, string> = {
    streams: "Most Streamed African Artists",
    listeners: "African Artists by Monthly Listeners",
    songs: "Most Streamed African Songs",
  };

  const isSongs = tab === "songs";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: tabLabels[tab] ?? "Leaderboard",
    url: `${BASE_URL}/leaderboard?tab=${tab}${country ? `&country=${country}` : ""}`,
    itemListElement: entries.slice(0, 20).map((entry, i) => ({
      "@type": "ListItem",
      position: entry.rank ?? i + 1,
      item: isSongs
        ? {
            "@type": "MusicRecording",
            name: entry.songTitle,
            ...(entry.songSlug && {
              url: `${BASE_URL}/songs/${entry.songSlug}`,
            }),
            ...(entry.songImageUrl && { image: entry.songImageUrl }),
            ...(entry.artistName && {
              byArtist: {
                "@type": "MusicGroup",
                name: entry.artistName,
                ...(entry.artistSlug && {
                  url: `${BASE_URL}/artists/${entry.artistSlug}`,
                }),
              },
            }),
          }
        : {
            "@type": "MusicGroup",
            name: entry.artistName,
            ...(entry.artistSlug && {
              url: `${BASE_URL}/artists/${entry.artistSlug}`,
            }),
            ...(entry.artistImageUrl && { image: entry.artistImageUrl }),
            ...(entry.originCountry && {
              foundingLocation: {
                "@type": "Place",
                name:
                  getCountryName(entry.originCountry) ?? entry.originCountry,
                addressCountry: entry.originCountry,
              },
            }),
          },
    })),
  };

  return (
    <Script
      id="schema-leaderboard"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function LeaderboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const tab = params.tab ?? "streams";
  const country = params.country || undefined;
  const page = Number(params.page ?? 1);
  const limit = 100;

  const [streamsRes, listenersRes, songsRes] = await Promise.allSettled([
    getStreamLeaderboard({ limit, country }),
    getListenerLeaderboard({ limit, country }),
    getSongLeaderboard({ limit }),
  ]);

  const streams =
    streamsRes.status === "fulfilled"
      ? streamsRes.value
      : { data: [], meta: { total: 0 } };

  const listeners =
    listenersRes.status === "fulfilled"
      ? listenersRes.value
      : { data: [], meta: { total: 0 } };

  const songs =
    songsRes.status === "fulfilled"
      ? songsRes.value
      : { data: [], meta: { total: 0 } };

  const activeEntries =
    tab === "streams"
      ? streams.data
      : tab === "listeners"
        ? listeners.data
        : songs.data;

  return (
    <>
      <LeaderboardSchema tab={tab} entries={activeEntries} country={country} />
      <LeaderboardView
        streams={streams}
        listeners={listeners}
        songs={songs}
        currentTab={tab}
        currentCountry={country}
        currentPage={page}
      />
    </>
  );
}
