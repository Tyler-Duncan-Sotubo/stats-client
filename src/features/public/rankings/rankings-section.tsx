// features/public/rankings/rankings-section.tsx
import { ArtistRankingCard } from "./artist-ranking-card";
import type { PublicArtist } from "@/lib/api/public";

interface RankingsSectionProps {
  title: string;
  artists: { slug: string; artist: PublicArtist }[];
}

export function RankingsSection({ title, artists }: RankingsSectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          {title}
        </h2>
        <span className="text-xs text-muted-foreground/50">
          {artists.length} artists
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {artists.map(({ slug, artist }) => (
          <ArtistRankingCard key={slug} slug={slug} artist={artist} />
        ))}
      </div>
    </section>
  );
}
