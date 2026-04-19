import { getAvailableCharts } from "@/lib/api/public";
import { ChartsView } from "@/features/public/charts/charts-view";
import type { Metadata } from "next";
import Script from "next/script";
import type { AvailableChart } from "@/lib/api/public";
import { CHART_LABELS } from "@/lib/constants/charts";

const BASE_URL = "https://tooxclusive.com/stats";

export const metadata: Metadata = {
  title: "Music Charts — TooXclusive Stats",
  description:
    "Browse African and Afrobeats music charts including the TooXclusive Top 100, UK Afrobeats Chart, Spotify Nigeria, Apple Music Nigeria and more.",
  keywords: [
    "African music charts",
    "Afrobeats charts",
    "TooXclusive Top 100",
    "UK Afrobeats chart",
    "Spotify Nigeria chart",
    "Apple Music Nigeria chart",
    "Nigerian music charts",
  ],
  openGraph: {
    title: "Music Charts — TooXclusive Stats",
    description:
      "Browse African and Afrobeats music charts including the TooXclusive Top 100, UK Afrobeats Chart, Spotify Nigeria and more.",
    url: `${BASE_URL}/charts`,
    siteName: "TooXclusive Stats",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tooxclusive",
    title: "Music Charts — TooXclusive Stats",
    description:
      "Browse African and Afrobeats music charts including the TooXclusive Top 100, UK Afrobeats Chart, Spotify Nigeria and more.",
  },
  alternates: {
    canonical: `${BASE_URL}/charts`,
  },
};

function ChartsPageSchema({ charts }: { charts: AvailableChart[] }) {
  if (!charts.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "African Music Charts",
    url: `${BASE_URL}/charts`,
    itemListElement: charts.map((chart, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MusicPlaylist",
        name: CHART_LABELS[chart.chartName] ?? chart.chartName,
        url: `${BASE_URL}/charts/${chart.chartName}/${chart.chartTerritory}`,
        numTracks: chart.totalEntries,
      },
    })),
  };

  return (
    <Script
      id="schema-charts"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ChartsPage() {
  const charts = await getAvailableCharts().catch(() => []);

  return (
    <>
      <ChartsPageSchema charts={charts} />
      <ChartsView charts={charts} />
    </>
  );
}
