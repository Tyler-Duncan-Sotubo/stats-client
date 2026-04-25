// features/public/rankings/rankings-view.tsx
import { RankingsHero } from "./rankings-hero";
import { RankingsSection } from "./rankings-section";
import type { PublicArtist } from "@/lib/api/public";

interface RankingsViewProps {
  artists: { slug: string; artist: PublicArtist }[];
}

export function RankingsView({ artists }: RankingsViewProps) {
  const afrobeats = artists.filter((a) => a.artist.isAfrobeats);
  const global = artists.filter((a) => !a.artist.isAfrobeats);

  return (
    <div className="pb-16">
      <RankingsHero />
      <RankingsSection
        title="Afrobeats & African Artists"
        artists={afrobeats}
      />
      <RankingsSection title="Global Artists" artists={global} />
    </div>
  );
}
