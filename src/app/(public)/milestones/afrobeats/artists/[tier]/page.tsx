import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArtistMilestone } from "@/lib/api/public";
import { MilestoneArtistView } from "@/features/public/milestones/milestone-artist-view";

const BASE_URL = "https://tooxclusive.com/stats";

const TIER_LABELS: Record<string, string> = {
  "500-million-streams": "500 Million",
  "1-billion-streams": "1 Billion",
  "5-billion-streams": "5 Billion",
};

interface Props {
  params: Promise<{ tier: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tier } = await params;
  const label = TIER_LABELS[tier];
  if (!label) return {};
  const title = `Afrobeats Artists with ${label}+ Spotify Streams — TooXclusive Stats`;
  const description = `Every Afrobeats artist on Spotify with over ${label} streams. Updated daily.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/milestones/afrobeats/artists/${tier}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/milestones/afrobeats/artists/${tier}`,
      siteName: "TooXclusive Stats",
      type: "website",
    },
  };
}

export default async function AfrobeatsArtistMilestonePage({
  params,
  searchParams,
}: Props) {
  const { tier } = await params;
  const { page: pageParam } = await searchParams;
  const label = TIER_LABELS[tier];
  if (!label) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1"));
  const result = await getArtistMilestone({
    tier,
    isAfrobeats: true,
    page,
    limit: 50,
  }).catch(() => null);
  if (!result) notFound();

  return (
    <MilestoneArtistView
      result={result}
      tier={tier}
      label={label}
      isAfrobeats
    />
  );
}
