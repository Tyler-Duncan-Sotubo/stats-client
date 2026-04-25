// features/public/ranking/ranking-intro.tsx
import type { ArtistSong } from "@/lib/api/public";

interface RankingIntroProps {
  artistName: string;
  limit: number;
  total: number;
  songs: ArtistSong[];
}

function formatStreams(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

export function RankingIntro({
  artistName,
  limit,
  total,
  songs,
}: RankingIntroProps) {
  const top = songs[0] ?? null;
  const second = songs[1] ?? null;

  const topStreams = top?.totalStreams ? Number(top.totalStreams) : null;
  const secondStreams = second?.totalStreams
    ? Number(second.totalStreams)
    : null;

  return (
    <div className="rounded-xl border border-border bg-muted/20 px-5 py-4 mb-6 space-y-2">
      <h2 className="text-base font-semibold text-foreground">
        About this ranking
      </h2>
      <p className="text-base text-muted-foreground leading-relaxed">
        This list ranks the top {limit} most streamed {artistName} songs on
        Spotify by total stream count, updated daily using live data from
        TooXclusive Stats.
        {top && topStreams && (
          <>
            {" "}
            <strong className="text-foreground">{top.title}</strong> leads as{" "}
            {artistName}&apos;s most streamed track with{" "}
            <strong className="text-foreground">
              {formatStreams(topStreams)}
            </strong>{" "}
            Spotify streams
            {second && secondStreams && (
              <>
                , followed by{" "}
                <strong className="text-foreground">{second.title}</strong> at{" "}
                <strong className="text-foreground">
                  {formatStreams(secondStreams)}
                </strong>{" "}
                streams
              </>
            )}
            .
          </>
        )}
        {total < limit && (
          <>
            {" "}
            Only {total} songs are currently tracked for {artistName} in our
            database.
          </>
        )}
      </p>
      <p className="text-xs text-muted-foreground/50">
        Stream counts are sourced from Spotify and may differ from official
        figures. Data is collected daily.
      </p>
    </div>
  );
}
