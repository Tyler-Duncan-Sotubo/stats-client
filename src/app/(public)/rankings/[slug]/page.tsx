// app/rankings/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getArtistSongRanking } from "@/lib/api/public";
import type { Metadata } from "next";
import type { ArtistSongRankingResponse } from "@/lib/api/public";
import { RankingView } from "@/features/public/ranking/ranking-view";
import {
  FEATURED_LIMITS,
  FEATURED_RANKING_ARTISTS,
} from "@/lib/constants/rankings";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  params: Promise<{ slug: string }>;
}

function parseRankingSlug(slug: string) {
  const match = slug.match(
    /^top-(\d+)-(.+)-songs-by-(streams|listeners|plays)$/,
  );
  if (!match) return null;

  const limit = parseInt(match[1]);
  if (limit < 1 || limit > 100) return null;

  return {
    limit,
    artistSlug: match[2],
    metric: match[3],
  };
}

export async function generateStaticParams() {
  return FEATURED_RANKING_ARTISTS.flatMap((artistSlug) =>
    FEATURED_LIMITS.map((limit) => ({
      slug: `top-${limit}-${artistSlug}-songs-by-streams`,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseRankingSlug(slug);
  if (!parsed) return {};

  let ranking: ArtistSongRankingResponse | null = null;
  try {
    ranking = await getArtistSongRanking(slug);
  } catch {
    return {};
  }

  const artistName =
    ranking?.meta.artistName ?? parsed.artistSlug.replace(/-/g, " ");
  const title = `Top ${parsed.limit} ${artistName} Songs By Streams — TooXclusive Stats`;
  const description = `The ${parsed.limit} most streamed ${artistName} songs on Spotify, ranked by total stream count. Updated daily.`;
  const url = `${BASE_URL}/rankings/${slug}`;
  const image = ranking?.meta.artistImage ?? null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TooXclusive Stats",
      type: "website",
      ...(image && {
        images: [{ url: image, width: 640, height: 640, alt: artistName }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@tooxclusive",
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function RankingPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseRankingSlug(slug);
  if (!parsed) notFound();

  let ranking: ArtistSongRankingResponse;
  try {
    ranking = await getArtistSongRanking(slug);
  } catch {
    notFound();
  }

  return <RankingView ranking={ranking} />;
}
