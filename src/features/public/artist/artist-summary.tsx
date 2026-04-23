import type { PublicArtist } from "@/lib/api/public";
import { buildArtistSummary } from "./utils/artist-summary";

export function ArtistSummary({ artist }: { artist: PublicArtist }) {
  const { intro, highlights, hasContent } = buildArtistSummary(artist);

  if (!hasContent) return null;

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4 mt-6">
      <p className="text-base text-muted-foreground leading-relaxed">
        {intro}
        {highlights.length > 0 && (
          <>
            {" "}
            {highlights.map((h, i) => (
              <span key={i}>{h} </span>
            ))}
          </>
        )}
      </p>
    </div>
  );
}
