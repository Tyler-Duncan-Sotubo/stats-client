// app/rankings/page.tsx
import type { Metadata } from "next";
import { getArtist } from "@/lib/api/public";
import { FEATURED_RANKING_ARTISTS } from "@/lib/constants/rankings";
import { RankingsView } from "@/features/public/rankings/rankings-view";
import type { PublicArtist } from "@/lib/api/public";

const BASE_URL = "https://tooxclusive.com/stats";

export const metadata: Metadata = {
  title: "Artist Song Rankings By Streams — TooXclusive Stats",
  description:
    "Browse the most streamed songs by your favourite artists on Spotify. Data-driven rankings updated daily for Afrobeats, African and global artists.",
  openGraph: {
    title: "Artist Song Rankings By Streams — TooXclusive Stats",
    description:
      "Browse the most streamed songs by your favourite artists on Spotify. Data-driven rankings updated daily.",
    url: `${BASE_URL}/rankings`,
    siteName: "TooXclusive Stats",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tooxclusive",
    title: "Artist Song Rankings By Streams — TooXclusive Stats",
    description:
      "Browse the most streamed songs by your favourite artists on Spotify.",
  },
  alternates: {
    canonical: `${BASE_URL}/rankings`,
  },
};

async function fetchArtists() {
  const results = await Promise.allSettled(
    FEATURED_RANKING_ARTISTS.map((slug) => getArtist(slug)),
  );

  return results
    .map((r, i) => ({
      slug: FEATURED_RANKING_ARTISTS[i],
      artist: r.status === "fulfilled" ? r.value : null,
    }))
    .filter((r) => r.artist !== null) as {
    slug: string;
    artist: PublicArtist;
  }[];
}

export default async function RankingsPage() {
  const artists = await fetchArtists();
  return <RankingsView artists={artists} />;
}
