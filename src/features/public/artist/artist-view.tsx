import type { PublicArtist, ArtistHistoryPoint } from "@/lib/api/public";
import { ArtistHero } from "./artist-hero";
import { ArtistStatRow } from "./artist-stat-row";
import { ArtistSummary } from "./artist-summary";
import { ArtistTopSongs } from "./artist-top-songs";
import { ArtistCharts } from "./artist-charts";
import { ArtistAwards } from "./artist-awards";
import { ArtistCertifications } from "./artist-certifications";
import { ArtistRecords } from "./artist-records";
import { ArtistSparkline } from "./artist-sparkline";
import { ArtistRelatedSearches } from "./artist-related-search";

interface ArtistViewProps {
  artist: PublicArtist;
  history: ArtistHistoryPoint[];
}

export function ArtistView({ artist, history }: ArtistViewProps) {
  return (
    <div className="pb-16">
      <ArtistHero artist={artist} />
      <div>
        <div className="space-y-3">
          <ArtistSummary artist={artist} />
          <ArtistStatRow artist={artist} />
        </div>
        <div className="mt-8 grid gap-8 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 flex flex-col gap-8">
            {history.length > 0 && <ArtistSparkline history={history} />}

            <ArtistTopSongs songs={artist.topSongs} />
            <ArtistRelatedSearches artist={artist} />

            <ArtistCharts charts={artist.charts} />
          </div>
          <div className="min-w-0 flex flex-col gap-6">
            <ArtistCertifications certifications={artist.certifications} />
            <ArtistRecords records={artist.records} />
            <ArtistAwards awards={artist.awards} />
          </div>
        </div>
      </div>
    </div>
  );
}
