import { getArtists } from "@/lib/api/public";
import { ArtistsView } from "@/features/public/artists/artists-view";
import type { Metadata } from "next";
import Script from "next/script";
import type { BrowseArtist } from "@/lib/api/public";
import { getCountryName } from "@/shared/utils/get-country-name";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  searchParams: Promise<{
    page?: string;
    letter?: string;
    country?: string;
    sortBy?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const letter = params.letter || undefined;
  const country = params.country || undefined;
  const sortBy = params.sortBy || "totalStreams";

  const sortLabels: Record<string, string> = {
    totalStreams: "Most Streamed",
    monthlyListeners: "Most Monthly Listeners",
    name: "A–Z",
  };

  const filters = [
    letter ? `starting with "${letter.toUpperCase()}"` : null,
    country ? `from ${getCountryName(country) ?? country}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const sortLabel = sortLabels[sortBy] ?? "Top";
  const title = filters
    ? `African Artists ${filters} — TooXclusive Stats`
    : `${sortLabel} African Artists — TooXclusive Stats`;

  const description = filters
    ? `Browse African and Afrobeats artists ${filters}, sorted by ${sortLabel.toLowerCase()}.`
    : `Discover the ${sortLabel.toLowerCase()} African and Afrobeats artists. Stream counts, monthly listeners and chart history.`;

  const urlParams = new URLSearchParams();
  if (letter) urlParams.set("letter", letter);
  if (country) urlParams.set("country", country);
  if (sortBy !== "totalStreams") urlParams.set("sortBy", sortBy);
  const queryString = urlParams.toString();
  const url = `${BASE_URL}/artists${queryString ? `?${queryString}` : ""}`;

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

function ArtistsSchema({
  artists,
  sortBy,
  country,
  letter,
}: {
  artists: BrowseArtist[];
  sortBy: string;
  country?: string;
  letter?: string;
}) {
  if (!artists.length) return null;

  const sortLabels: Record<string, string> = {
    totalStreams: "Most Streamed African Artists",
    monthlyListeners: "African Artists by Monthly Listeners",
    name: "African Artists A–Z",
  };

  const name = [
    sortLabels[sortBy] ?? "African Artists",
    country ? `from ${getCountryName(country) ?? country}` : null,
    letter ? `— ${letter.toUpperCase()}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${BASE_URL}/artists`,
    itemListElement: artists.slice(0, 20).map((artist, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MusicGroup",
        name: artist.name,
        ...(artist.slug && { url: `${BASE_URL}/artists/${artist.slug}` }),
        ...(artist.imageUrl && { image: artist.imageUrl }),
        ...(artist.originCountry && {
          foundingLocation: {
            "@type": "Place",
            name: getCountryName(artist.originCountry) ?? artist.originCountry,
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
      },
    })),
  };

  return (
    <Script
      id="schema-artists"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ArtistsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const letter = params.letter || undefined;
  const country = params.country || undefined;
  const sortBy =
    (params.sortBy as "name" | "totalStreams" | "monthlyListeners") ||
    "totalStreams";

  const result = await getArtists({
    page,
    limit: 100,
    letter,
    country,
    sortBy,
  }).catch(() => null);

  const artists = result?.data ?? [];

  return (
    <>
      <ArtistsSchema
        artists={artists}
        sortBy={sortBy}
        country={country}
        letter={letter}
      />
      <ArtistsView
        artists={artists}
        meta={result?.meta ?? { total: 0, page: 1, limit: 50, totalPages: 0 }}
        currentLetter={letter}
        currentCountry={country}
        currentSort={sortBy}
      />
    </>
  );
}
