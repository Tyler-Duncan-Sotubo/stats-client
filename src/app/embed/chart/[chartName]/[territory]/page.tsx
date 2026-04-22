import type { Metadata } from "next";
import { getChartCached } from "@/lib/api/public";
import { ChartEmbedView } from "@/features/public/charts/chart-embed-view";

export const revalidate = 1800;

interface Props {
  params: Promise<{ chartName: string; territory: string }>;
  searchParams: Promise<{ limit?: string }>;
}

const CHART_LABELS: Record<string, string> = {
  top100: "Top 100",
  trending: "Trending",
  new_releases: "New Releases",
  afrobeats: "Afrobeats",
  // add more as needed
};

const TERRITORY_LABELS: Record<string, string> = {
  ng: "Nigeria",
  gh: "Ghana",
  uk: "UK",
  us: "US",
  global: "Global",
  // add more as needed
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chartName, territory } = await params;

  const chart = CHART_LABELS[chartName] ?? chartName;
  const region = TERRITORY_LABELS[territory] ?? territory.toUpperCase();

  const title = `${region} ${chart} Chart`;
  const description = `The latest ${chart} music chart for ${region} on Tooxclusive.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ChartEmbedPage({ params, searchParams }: Props) {
  const { chartName, territory } = await params;
  const { limit } = await searchParams;

  const data = await getChartCached(
    chartName,
    territory,
    Math.min(Number(limit ?? 10), 10),
    1800,
  ).catch(() => null);

  return (
    <ChartEmbedView data={data} chartName={chartName} territory={territory} />
  );
}
