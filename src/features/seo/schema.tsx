// src/features/public/home/home-schema.tsx
import Script from "next/script";
import type { TrendingArtist, ChartEntry } from "@/lib/api/public";

const BASE_URL = "https://tooxclusive.com/stats";

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TooXclusive Stats",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/artists?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="schema-website"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TooXclusive",
    url: "https://tooxclusive.com",
    logo: "https://tooxclusive.com/logo.png",
    sameAs: [
      "https://twitter.com/tooxclusive",
      "https://instagram.com/tooxclusive",
      "https://youtube.com/tooxclusive",
    ],
  };

  return (
    <Script
      id="schema-organization"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ChartSchema({ entries }: { entries: ChartEntry[] }) {
  if (!entries.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: "TooXclusive Top 100",
    url: `${BASE_URL}/charts/tooxclusive_top_100/NG`,
    numTracks: entries.length,
    track: entries.slice(0, 10).map((entry) => ({
      "@type": "MusicRecording",
      position: entry.position,
      name: entry.songTitle,
      byArtist: {
        "@type": "MusicGroup",
        name: entry.artistName,
        ...(entry.artistSlug && {
          url: `${BASE_URL}/artists/${entry.artistSlug}`,
        }),
        ...(entry.artistImageUrl && { image: entry.artistImageUrl }),
      },
      ...(entry.songSlug && {
        url: `${BASE_URL}/songs/${entry.songSlug}`,
      }),
    })),
  };

  return (
    <Script
      id="schema-chart"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function TrendingArtistsSchema({
  artists,
}: {
  artists: TrendingArtist[];
}) {
  if (!artists.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trending African Artists",
    url: `${BASE_URL}/leaderboard`,
    itemListElement: artists.slice(0, 10).map((artist, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MusicGroup",
        name: artist.name,
        ...(artist.slug && { url: `${BASE_URL}/artists/${artist.slug}` }),
        ...(artist.imageUrl && { image: artist.imageUrl }),
        ...(artist.originCountry && {
          foundingLocation: {
            "@type": "Place",
            addressCountry: artist.originCountry,
          },
        }),
      },
    })),
  };

  return (
    <Script
      id="schema-trending-artists"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
