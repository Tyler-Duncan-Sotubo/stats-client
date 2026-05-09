import { notFound } from "next/navigation";
import { getAlbum } from "@/lib/api/public";
import { AlbumView } from "@/features/public/album/album-view";
import type { Metadata } from "next";
import Script from "next/script";
import type { FullAlbum } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let data: FullAlbum | null = null;
  try {
    data = await getAlbum(slug);
  } catch {
    return {};
  }

  const { album } = data;
  const title = `${album.title} by ${album.artistName} — Stats, Streams & Tracklist | TooXclusive`;
  const description = [
    `${album.title} by ${album.artistName}.`,
    album.totalStreams
      ? `${formatNumber(album.totalStreams)} Spotify streams.`
      : null,
    album.totalTracks ? `${album.totalTracks} tracks.` : null,
    album.releaseDate ? `Released ${album.releaseDate}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const url = `${BASE_URL}/albums/${slug}`;
  const image = album.imageUrl ?? null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TooXclusive Stats",
      type: "music.album",
      ...(image && {
        images: [{ url: image, width: 640, height: 640, alt: album.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@tooxclusive",
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: { canonical: url },
  };
}

function AlbumSchema({ data }: { data: FullAlbum }) {
  const { album, tracklist } = data;

  const schema = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: album.title,
    url: `${BASE_URL}/albums/${album.slug}`,
    ...(album.imageUrl && { image: album.imageUrl }),
    ...(album.releaseDate && { datePublished: album.releaseDate }),
    numTracks: album.totalTracks,
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
    track: tracklist.map((t) => ({
      "@type": "MusicRecording",
      name: t.title,
      ...(t.slug && { url: `${BASE_URL}/songs/${t.slug}` }),
      ...(t.spotifyTrackId && {
        sameAs: `https://open.spotify.com/track/${t.spotifyTrackId}`,
      }),
      ...(t.durationMs && {
        duration: `PT${Math.floor(t.durationMs / 60000)}M${Math.floor((t.durationMs % 60000) / 1000)}S`,
      }),
      ...(t.totalStreams && {
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/ListenAction",
          userInteractionCount: t.totalStreams,
        },
      }),
    })),
  };

  return (
    <Script
      id="schema-album"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params;

  try {
    const data = await getAlbum(slug);

    return (
      <>
        <AlbumSchema data={data} />
        <AlbumView data={data} />
      </>
    );
  } catch {
    notFound();
  }
}
