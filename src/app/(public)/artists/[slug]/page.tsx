import { notFound } from "next/navigation";
import { getArtist } from "@/lib/api/public";
import { ArtistView } from "@/features/public/artist/artist-view";
import type { Metadata } from "next";
import Script from "next/script";
import type { PublicArtist } from "@/lib/api/public";
import { getCountryName } from "@/shared/utils/get-country-name";
import { getChartLabel } from "@/lib/constants/charts";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let artist: PublicArtist | null = null;
  try {
    artist = await getArtist(slug);
  } catch {
    return {};
  }

  const country = artist.originCountry
    ? getCountryName(artist.originCountry)
    : null;

  const bestChart = artist.charts
    .filter((c) => c.role === "primary")
    .sort(
      (a, b) => (a.bestPeakPosition ?? 999) - (b.bestPeakPosition ?? 999),
    )[0];

  const description = [
    `${artist.name}${country ? ` from ${country}` : ""}.`,
    artist.totalStreams
      ? `${(artist.totalStreams / 1e9).toFixed(1)}B Spotify streams.`
      : null,
    artist.monthlyListeners
      ? `${(artist.monthlyListeners / 1e6).toFixed(1)}M monthly listeners.`
      : null,
    bestChart
      ? `Peaked at #${bestChart.bestPeakPosition} on the ${getChartLabel(bestChart.chartName)}.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const title = `${artist.name} — Stats, Charts & Streams | TooXclusive`;
  const url = `${BASE_URL}/artists/${slug}`;
  const image = artist.imageUrl ?? null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TooXclusive Stats",
      type: "profile",
      ...(image && {
        images: [{ url: image, width: 640, height: 640, alt: artist.name }],
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

function ArtistSchema({ artist }: { artist: PublicArtist }) {
  const country = artist.originCountry
    ? getCountryName(artist.originCountry)
    : null;

  const primaryCharts = artist.charts.filter((c) => c.role === "primary");

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    url: `${BASE_URL}/artists/${artist.slug}`,
    ...(artist.imageUrl && { image: artist.imageUrl }),
    ...(artist.spotifyId && {
      sameAs: `https://open.spotify.com/artist/${artist.spotifyId}`,
    }),
    ...(artist.originCountry && {
      foundingLocation: {
        "@type": "Place",
        name: country ?? artist.originCountry,
        addressCountry: artist.originCountry,
      },
    }),
    ...(artist.totalStreams && {
      interactionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/ListenAction",
        userInteractionCount: artist.totalStreams,
      },
    }),
    ...(artist.monthlyListeners && {
      followersCount: artist.monthlyListeners,
    }),
    ...(primaryCharts.length > 0 && {
      memberOf: primaryCharts.slice(0, 5).map((c) => ({
        "@type": "MusicPlaylist",
        name: getChartLabel(c.chartName),
        url: `${BASE_URL}/charts/${c.chartName}/${c.chartTerritory}`,
      })),
    }),
    ...(artist.awards.length > 0 && {
      award: artist.awards
        .filter((a) => a.result === "won")
        .slice(0, 5)
        .map((a) => `${a.awardName} — ${a.awardBody} (${a.year})`),
    }),
    ...(artist.topSongs.length > 0 && {
      track: artist.topSongs.slice(0, 5).map((s) => ({
        "@type": "MusicRecording",
        name: s.title,
        ...(s.slug && { url: `${BASE_URL}/songs/${s.slug}` }),
        ...(s.spotifyTrackId && {
          sameAs: `https://open.spotify.com/track/${s.spotifyTrackId}`,
        }),
        ...(s.totalStreams && {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ListenAction",
            userInteractionCount: s.totalStreams,
          },
        }),
      })),
    }),
    ...(artist.certifications.length > 0 && {
      description: artist.certifications
        .slice(0, 3)
        .map(
          (c) =>
            `${c.totalPlatinumUnits}x Platinum (${c.body}, ${c.territory})`,
        )
        .join(", "),
    }),
  };

  return (
    <Script
      id="schema-artist"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;

  try {
    const artist = await getArtist(slug);
    return (
      <>
        <ArtistSchema artist={artist} />
        <ArtistView artist={artist} />
      </>
    );
  } catch {
    notFound();
  }
}
