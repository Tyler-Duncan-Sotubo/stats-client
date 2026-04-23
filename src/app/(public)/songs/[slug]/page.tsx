import { notFound } from "next/navigation";
import { getSong } from "@/lib/api/public";
import { SongView } from "@/features/public/songs/song-view";
import type { Metadata } from "next";
import Script from "next/script";
import type { PublicSong } from "@/lib/api/public";
import { getChartLabel } from "@/lib/constants/charts";
import { buildSongSummary } from "@/features/public/songs/utils/song-summary";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let song: PublicSong | null = null;
  try {
    song = await getSong(slug);
  } catch {
    return {};
  }

  const title = `${song.title}${song.artistName ? ` by ${song.artistName}` : ""} — TooXclusive Stats`;

  const chartMentions = song.charts
    .slice(0, 2)
    .map((c) => `${getChartLabel(c.chartName)} (#${c.peakPosition})`)
    .join(", ");

  const description = [
    song.artistName ? `${song.title} by ${song.artistName}.` : song.title,
    song.totalStreams
      ? `${(song.totalStreams / 1e6).toFixed(1)}M Spotify streams.`
      : null,
    chartMentions ? `Charted on ${chartMentions}.` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const url = `${BASE_URL}/songs/${slug}`;
  const image = song.imageUrl ?? song.artistImageUrl ?? null;
  const { metaDescription } = buildSongSummary(song);

  return {
    title,
    description: metaDescription || description,
    openGraph: {
      title,
      description: metaDescription || description,
      url,
      siteName: "TooXclusive Stats",
      type: "music.song",
      ...(image && {
        images: [{ url: image, width: 640, height: 640, alt: song.title }],
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

function SongSchema({ song }: { song: PublicSong }) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: song.title,
    url: `${BASE_URL}/songs/${song.slug}`,
    ...(song.imageUrl && { image: song.imageUrl }),
    ...(song.releaseDate && { datePublished: song.releaseDate }),
    ...(song.explicit !== undefined && {
      contentRating: song.explicit ? "explicit" : "clean",
    }),
    ...(song.artistName && {
      byArtist: {
        "@type": "MusicGroup",
        name: song.artistName,
        ...(song.artistSlug && {
          url: `${BASE_URL}/artists/${song.artistSlug}`,
        }),
        ...(song.artistImageUrl && { image: song.artistImageUrl }),
      },
    }),
    ...(song.spotifyTrackId && {
      sameAs: `https://open.spotify.com/track/${song.spotifyTrackId}`,
    }),
    ...(song.totalStreams && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ListenAction",
        userInteractionCount: song.totalStreams,
      },
    }),
    ...(song.charts.length > 0 && {
      inPlaylist: song.charts.slice(0, 5).map((c) => ({
        "@type": "MusicPlaylist",
        name: getChartLabel(c.chartName),
        url: `${BASE_URL}/charts/${c.chartName}/${c.chartTerritory}`,
      })),
    }),
    ...(song.features.length > 0 && {
      creditedTo: song.features.map((f) => ({
        "@type": "MusicGroup",
        name: f.artistName,
        ...(f.artistSlug && { url: `${BASE_URL}/artists/${f.artistSlug}` }),
        ...(f.artistImageUrl && { image: f.artistImageUrl }),
      })),
    }),
  };

  return (
    <Script
      id="schema-song"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function SongPage({ params }: Props) {
  const { slug } = await params;

  try {
    const song = await getSong(slug);
    return (
      <>
        <SongSchema song={song} />
        <SongView song={song} />
      </>
    );
  } catch {
    notFound();
  }
}
