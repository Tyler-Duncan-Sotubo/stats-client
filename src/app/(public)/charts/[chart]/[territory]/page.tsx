import { notFound } from "next/navigation";
import { getChart } from "@/lib/api/public";
import { ChartDetailView } from "@/features/public/charts/chart-detail-view";
import type { Metadata } from "next";
import Script from "next/script";
import type { ChartResponse } from "@/lib/api/public";
import { CHART_LABELS } from "@/lib/constants/charts";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  params: Promise<{ chart: string; territory: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chart, territory } = await params;

  let data: ChartResponse | null = null;
  try {
    data = await getChart(chart, territory, 100);
  } catch {
    return {};
  }

  const chartLabel = CHART_LABELS[chart] ?? chart;
  const week = data.chartWeek
    ? new Date(data.chartWeek).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const top3 = data.data
    .slice(0, 3)
    .map((e) => e.songTitle)
    .join(", ");

  const title = `${chartLabel} — TooXclusive Stats`;
  const description = week
    ? `${chartLabel} for the week of ${week}. Featuring ${top3} and more.`
    : `${chartLabel} chart with ${data.meta.total} entries. Featuring ${top3} and more.`;

  const url = `${BASE_URL}/charts/${chart}/${territory}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TooXclusive Stats",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@tooxclusive",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

function ChartDetailSchema({ data }: { data: ChartResponse }) {
  const chartLabel = CHART_LABELS[data.chartName] ?? data.chartName;
  const url = `${BASE_URL}/charts/${data.chartName}/${data.chartTerritory}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicPlaylist",
    name: chartLabel,
    url,
    numTracks: data.meta.total,
    ...(data.chartWeek && {
      datePublished: data.chartWeek,
    }),
    track: data.data.slice(0, 20).map((entry) => ({
      "@type": "MusicRecording",
      position: entry.position,
      name: entry.songTitle,
      ...(entry.songSlug && { url: `${BASE_URL}/songs/${entry.songSlug}` }),
      ...(entry.songImageUrl && { image: entry.songImageUrl }),
      byArtist: {
        "@type": "MusicGroup",
        name: entry.artistName,
        ...(entry.artistSlug && {
          url: `${BASE_URL}/artists/${entry.artistSlug}`,
        }),
        ...(entry.artistImageUrl && { image: entry.artistImageUrl }),
      },
    })),
  };

  return (
    <Script
      id="schema-chart-detail"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ChartDetailPage({ params }: Props) {
  const { chart, territory } = await params;

  try {
    const data = await getChart(chart, territory, 200);
    return (
      <>
        <ChartDetailSchema data={data} />
        <ChartDetailView data={data} />
      </>
    );
  } catch {
    notFound();
  }
}
