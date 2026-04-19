import type { PublicArtist } from "@/lib/api/public";
import { ArtistHero } from "./artist-hero";
import { ArtistStatRow } from "./artist-stat-row";
import { ArtistTopSongs } from "./artist-top-songs";
import { ArtistCharts } from "./artist-charts";
import { ArtistAwards } from "./artist-awards";
import { ArtistCertifications } from "./artist-certifications";
import { ArtistRecords } from "./artist-records";

interface ArtistViewProps {
  artist: PublicArtist;
}

export function ArtistView({ artist }: ArtistViewProps) {
  return (
    <div className="pb-16">
      <ArtistHero artist={artist} />

      <div>
        <ArtistStatRow artist={artist} />

        <div className="mt-8 grid gap-8 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <ArtistTopSongs songs={artist.topSongs} />
            <ArtistCharts charts={artist.charts} />
            <ArtistAwards awards={artist.awards} />
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            <ArtistCertifications certifications={artist.certifications} />
            <ArtistRecords records={artist.records} />
          </div>
        </div>
      </div>
    </div>
  );
}
