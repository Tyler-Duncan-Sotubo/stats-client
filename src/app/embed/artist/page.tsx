import { getArtistCached } from "@/lib/api/public";
import { ArtistEmbedView } from "@/features/public/artist/artist-embed-view";

// No revalidate — we want a fresh random pick each load
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ slugs?: string; slug?: string }>;
}

export default async function ArtistEmbedPage({ searchParams }: Props) {
  const { slugs, slug } = await searchParams;

  let artistSlug: string | null = null;

  if (slugs) {
    // Pick random from list
    const list = slugs
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    artistSlug = list[Math.floor(Math.random() * list.length)];
  } else if (slug) {
    // Single artist
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
