import type { Metadata } from "next";
import { getMilestoneFacts } from "@/lib/api/public";
import { MilestoneFactsHubView } from "@/features/public/milestones/facts/milestone-facts-hub-view";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  searchParams: Promise<{
    page?: string;
    isAfrobeats?: string;
    metric?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Spotify Streaming Milestones — TooXclusive Stats",
    description:
      "Every artist and song that has crossed a major Spotify streaming milestone. 100M, 500M, 1B streams and beyond.",
    alternates: { canonical: `${BASE_URL}/milestones/facts` },
    openGraph: {
      title: "Spotify Streaming Milestones — TooXclusive Stats",
      description:
        "Every artist and song that has crossed a major Spotify streaming milestone.",
      url: `${BASE_URL}/milestones/facts`,
      siteName: "TooXclusive Stats",
      type: "website",
    },
  };
}

export default async function MilestoneFactsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const isAfrobeats =
    params.isAfrobeats === "true"
      ? true
      : params.isAfrobeats === "false"
        ? false
        : undefined;
  const metric = params.metric || undefined;

  const result = await getMilestoneFacts({
    page,
    limit: 50,
    isAfrobeats,
    metric,
  }).catch(() => null);

  return (
    <MilestoneFactsHubView
      data={result?.data ?? []}
      meta={result?.meta ?? { total: 0, page: 1, limit: 50, totalPages: 0 }}
      currentIsAfrobeats={isAfrobeats}
      currentMetric={metric}
    />
  );
}
