import Link from "next/link";
import type { PublicArtist } from "@/lib/api/public";
import { buildArtistSummary } from "./utils/artist-summary";

function formatListeners(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

export function ArtistSummary({ artist }: { artist: PublicArtist }) {
  const { intro, highlights, hasContent, rankContext } =
    buildArtistSummary(artist);

  if (!hasContent) return null;

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 mt-6">
      <p className="text-base text-muted-foreground leading-relaxed">
        {intro}{" "}
        {rankContext && (
          <span>
            {artist.name} is currently ranked #{rankContext.listenerRank}{" "}
            globally on Spotify
            {rankContext.dailyListenersChange &&
              rankContext.dailyListenersChange !== 0 && (
                <>
                  {" "}
                  —{" "}
                  {rankContext.dailyListenersChange > 0
                    ? "gaining"
                    : "losing"}{" "}
                  {formatListeners(Math.abs(rankContext.dailyListenersChange))}{" "}
                  listeners yesterday
                </>
              )}
            {rankContext.artistAbove && rankContext.artistBelow && (
              <>
                {" "}
                — ranking above{" "}
                <Link
                  href={`/artists/${rankContext.artistBelow.slug}`}
                  className="text-foreground underline underline-offset-2 hover:text-primary"
                >
                  {rankContext.artistBelow.name}
                </Link>{" "}
                but below{" "}
                <Link
                  href={`/artists/${rankContext.artistAbove.slug}`}
                  className="text-foreground underline underline-offset-2 hover:text-primary"
                >
                  {rankContext.artistAbove.name}
                </Link>{" "}
                this week
              </>
            )}
            .{" "}
          </span>
        )}
        {highlights.map((h, i) => (
          <span key={i}>{h} </span>
        ))}
      </p>
    </div>
  );
}
