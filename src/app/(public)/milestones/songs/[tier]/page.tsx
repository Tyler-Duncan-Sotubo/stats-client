import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSongMilestone } from "@/lib/api/public";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { MilestonePagination } from "@/features/public/milestones/milestone-pagination";
import { MilestoneSongView } from "@/features/public/milestones/milestone-song-view";

const BASE_URL = "https://tooxclusive.com/stats";

const TIER_LABELS: Record<string, string> = {
  "100-million-streams": "100 Million",
  "500-million-streams": "500 Million",
  "1-billion-streams": "1 Billion",
};

interface Props {
  params: Promise<{ tier: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tier } = await params;
  const label = TIER_LABELS[tier];
  if (!label) return {};

  const title = `Songs with ${label}+ Spotify Streams — TooXclusive Stats`;
  const description = `Every song on Spotify with over ${label} streams. Updated daily.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/milestones/songs/${tier}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/milestones/songs/${tier}`,
      siteName: "TooXclusive Stats",
      type: "website",
    },
  };
}

export default async function SongMilestonePage({
  params,
  searchParams,
}: Props) {
  const { tier } = await params;
  const { page: pageParam } = await searchParams;
  const label = TIER_LABELS[tier];

  if (!label) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1"));

  const result = await getSongMilestone({ tier, page, limit: 50 }).catch(
    () => null,
  );
  if (!result) notFound();

  return <MilestoneSongView result={result} tier={tier} label={label} />;
}
