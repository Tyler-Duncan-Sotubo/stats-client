import type { PublicSong } from "@/lib/api/public";
import { buildSongSummary } from "./utils/song-summary";

export function SongSummary({ song }: { song: PublicSong }) {
  const { intro, highlights, hasContent } = buildSongSummary(song);

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
