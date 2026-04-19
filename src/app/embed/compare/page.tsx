import { getArtistCached } from "@/lib/api/public";
import { CompareEmbedView } from "@/features/public/compare/compare-embed-view";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ left?: string; right?: string }>;
}

export default async function CompareEmbedPage({ searchParams }: Props) {
  const { left, right } = await searchParams;

  const [leftArtist, rightArtist] = await Promise.all([
    left ? getArtistCached(left, 3600).catch(() => null) : null,
    right ? getArtistCached(right, 3600).catch(() => null) : null,
  ]);

  return <CompareEmbedView left={leftArtist} right={rightArtist} />;
}
