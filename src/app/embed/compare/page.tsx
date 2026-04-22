import type { Metadata } from "next";
import { getArtistCached } from "@/lib/api/public";
import { CompareEmbedView } from "@/features/public/compare/compare-embed-view";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ left?: string; right?: string }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { left, right } = await searchParams;

  const [leftArtist, rightArtist] = await Promise.all([
    left ? getArtistCached(left, 3600).catch(() => null) : null,
    right ? getArtistCached(right, 3600).catch(() => null) : null,
  ]);

  const bothLoaded = leftArtist && rightArtist;
  const oneLoaded = leftArtist || rightArtist;

  const title = bothLoaded
    ? `${leftArtist.name} vs ${rightArtist.name}`
    : oneLoaded
      ? `${(leftArtist ?? rightArtist)!.name} — Artist Compare`
      : "Artist Comparison";

  const description = bothLoaded
    ? `Compare ${leftArtist.name} and ${rightArtist.name} — streams, charts, and stats on Tooxclusive.`
    : "Compare two artists side by side on Tooxclusive.";

  const images = [leftArtist?.imageUrl, rightArtist?.imageUrl].filter(
    Boolean,
  ) as string[];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: images.map((url) => ({ url })),
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function CompareEmbedPage({ searchParams }: Props) {
  const { left, right } = await searchParams;

  const [leftArtist, rightArtist] = await Promise.all([
    left ? getArtistCached(left, 3600).catch(() => null) : null,
    right ? getArtistCached(right, 3600).catch(() => null) : null,
  ]);

  return <CompareEmbedView left={leftArtist} right={rightArtist} />;
}
