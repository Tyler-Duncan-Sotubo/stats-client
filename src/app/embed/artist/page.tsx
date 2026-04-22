import type { Metadata } from "next";
import { getArtistCached } from "@/lib/api/public";
import { ArtistEmbedView } from "@/features/public/artist/artist-embed-view";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ slugs?: string; slug?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { slugs, slug } = await searchParams;

  let artistSlug: string | null = null;

  if (slugs) {
    const list = slugs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    artistSlug = list[0]; // use first for metadata
  } else if (slug) {
    artistSlug = slug;
  }

  if (!artistSlug) {
    return {
      title: "Artist Embed",
    };
  }

  const artist = await getArtistCached(artistSlug, 3600).catch(() => null);

  if (!artist) {
    return {
      title: "Artist Not Found",
    };
  }

  return {
    title: `${artist.name} — Artist Profile`,
    description: `Stream and discover music by ${artist.name} on Tooxclusive.`,
    openGraph: {
      title: `${artist.name} — Artist Profile`,
      description: `Stream and discover music by ${artist.name} on Tooxclusive.`,
      images: artist.imageUrl ? [{ url: artist.imageUrl }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${artist.name} — Artist Profile`,
      description: `Stream and discover music by ${artist.name} on Tooxclusive.`,
      images: artist.imageUrl ? [artist.imageUrl] : [],
    },
  };
}

export default async function ArtistEmbedPage({ searchParams }: Props) {
  const { slugs, slug } = await searchParams;

  let artistSlug: string | null = null;

  if (slugs) {
    const list = slugs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    artistSlug = list[Math.floor(Math.random() * list.length)];
  } else if (slug) {
    artistSlug = slug;
  }

  if (!artistSlug) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No artist specified
      </div>
    );
  }

  const artist = await getArtistCached(artistSlug, 3600).catch(() => null);

  return <ArtistEmbedView artist={artist} />;
}
