// features/public/ranking/ranking-footer.tsx
interface RankingFooterProps {
  generatedAt: string;
  artistName: string;
  artistSlug: string;
  limit: number;
}

export function RankingFooter({
  generatedAt,
  artistName,
  artistSlug,
  limit,
}: RankingFooterProps) {
  const otherLimits = [10, 20, 50].filter((l) => l !== limit);

  return (
    <div className="mt-8 space-y-4">
      {/* Other rankings for this artist */}
      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-xs text-muted-foreground/60 uppercase tracking-widest mb-2 font-semibold">
          More {artistName} rankings
        </p>
        <div className="flex gap-3 flex-wrap">
          {otherLimits.map((l) => (
            <a
              key={l}
              href={`/stats/rankings/top-${l}-${artistSlug}-songs-by-streams`}
              className="text-sm text-primary hover:underline"
            >
              Top {l} songs →
            </a>
          ))}
        </div>
      </div>

      {/* Data credit */}
      <p className="text-xs text-muted-foreground/40 text-center">
        Data from Spotify · Updated daily ·{" "}
        {new Date(generatedAt).toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </div>
  );
}
