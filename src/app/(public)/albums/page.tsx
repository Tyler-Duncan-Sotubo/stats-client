import { getAlbums } from "@/lib/api/public";
import { AlbumsView } from "@/features/public/albums/albums-view";
import type { Metadata } from "next";
import Script from "next/script";
import type { PublicAlbum } from "@/lib/api/public";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    albumType?: string;
    isAfrobeats?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const sortBy = params.sortBy || "totalStreams";
  const albumType = params.albumType;

  const sortLabels: Record<string, string> = {
    totalStreams: "Most Streamed",
    dailyStreams: "Trending",
    releaseDate: "Latest",
  };

  const typeLabel =
    albumType === "single" ? "Singles" : albumType === "ep" ? "EPs" : "Albums";
  const sortLabel = sortLabels[sortBy] ?? "Top";

  const title = `${sortLabel} Afrobeats ${typeLabel} — TooXclusive Stats`;
  const description = `Discover the ${sortLabel.toLowerCase()} Afrobeats ${typeLabel.toLowerCase()}. Total streams, tracklists and chart history.`;
  const url = `${BASE_URL}/albums`;

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
    alternates: { canonical: url },
  };
}

function AlbumsSchema({ albums }: { albums: PublicAlbum[] }) {
  if (!albums.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Most Streamed Afrobeats Albums",
    url: `${BASE_URL}/albums`,
    itemListElement: albums.slice(0, 20).map((album, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MusicAlbum",
        name: album.title,
        url: `${BASE_URL}/albums/${album.slug}`,
        ...(album.imageUrl && { image: album.imageUrl }),
        ...(album.releaseDate && { datePublished: album.releaseDate }),
        byArtist: {
          "@type": "MusicGroup",
          name: album.artistName,
          url: `${BASE_URL}/artists/${album.artistSlug}`,
        },
        ...(album.totalStreams && {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ListenAction",
            userInteractionCount: album.totalStreams,
          },
        }),
      },
    })),
  };

  return (
    <Script
      id="schema-albums"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function AlbumsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const sortBy =
    (params.sortBy as "totalStreams" | "dailyStreams" | "releaseDate") ||
    "totalStreams";
  const albumType = params.albumType || undefined;
  const isAfrobeats =
    params.isAfrobeats === "true"
      ? true
      : params.isAfrobeats === "false"
        ? false
        : undefined;

  const result = await getAlbums({
    page,
    limit: 50,
    isAfrobeats,
    sortBy,
    albumType,
  }).catch(() => null);

  const albums = result?.data ?? [];

  return (
    <>
      <AlbumsSchema albums={albums} />
      <AlbumsView
        albums={albums}
        meta={result?.meta ?? { total: 0, page: 1, limit: 50, totalPages: 0 }}
        currentSort={sortBy}
        currentAlbumType={albumType}
        currentIsAfrobeats={isAfrobeats}
      />
    </>
  );
}
