// features/public/ranking/ranking-view.tsx
import type { ArtistSongRankingResponse } from "@/lib/api/public";
import { RankingHeader } from "./ranking-header";
import { RankingIntro } from "./ranking-intro";
import { RankingList } from "./ranking-list";
import { RankingFooter } from "./ranking-footer";

interface RankingViewProps {
  ranking: ArtistSongRankingResponse;
}

export function RankingView({ ranking }: RankingViewProps) {
  const { data, meta } = ranking;

  const topSong = data[0] ?? null;

  return (
    <div className="max-w-2xl pb-16">
      <RankingHeader
        artistName={meta.artistName}
        artistSlug={meta.artistSlug}
        artistImage={meta.artistImage}
        limit={meta.limit}
        total={meta.total}
        generatedAt={meta.generatedAt}
      />

      <RankingIntro
        artistName={meta.artistName}
        limit={meta.limit}
        total={meta.total}
        songs={data}
      />

      <RankingList songs={data} />

      <RankingFooter
        generatedAt={meta.generatedAt}
        artistName={meta.artistName}
        artistSlug={meta.artistSlug}
        limit={meta.limit}
      />
    </div>
  );
}
