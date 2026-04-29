// milestone-song-summary.tsx

import Link from "next/link";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import type { MilestoneSongResponse } from "@/lib/api/public";

interface Props {
  data: MilestoneSongResponse["data"];
  meta: MilestoneSongResponse["meta"];
  label: string;
}

export function MilestoneSongSummary({ data, meta, label }: Props) {
  const topSong = data[0];
  const topArtists = [
    ...new Map(data.map((s) => [s.artistName, s])).values(),
  ].slice(0, 3);

  return (
    <div className="mb-8 space-y-4">
      {/* Prose paragraph for Google */}
      <div className="rounded-xl border border-border bg-muted/20 px-5 py-4">
        <p className="text-base text-foreground leading-relaxed">
          This page tracks every song on Spotify that has surpassed{" "}
          <strong>{label} streams</strong> — currently{" "}
          <strong>{formatNumber(meta.total)} songs</strong> in total. The
          most-streamed song in this tier is{" "}
          <Link
            href={topSong.songSlug ? `/songs/${topSong.songSlug}` : "#"}
            className="font-semibold text-primary hover:underline"
          >
            {toTitleCase(topSong.songTitle)}
          </Link>{" "}
          by <strong>{topSong.artistName}</strong> with{" "}
          <strong>{formatNumber(topSong.totalStreams)} total streams</strong>.
          Leading artists in this milestone include{" "}
          {topArtists.map((a, i) => (
            <span key={a.artistName}>
              <strong>{a.artistName}</strong>
              {i < topArtists.length - 1 ? ", " : ""}
            </span>
          ))}
          . Data is refreshed daily.
        </p>
      </div>
    </div>
  );
}

// ---- internal StatCard ----

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  truncate?: boolean;
  href?: string;
}

function StatCard({ label, value, sub, truncate, href }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      {href ? (
        <Link
          href={href}
          className={`text-sm font-bold text-primary hover:underline leading-snug ${truncate ? "truncate" : ""}`}
        >
          {value}
        </Link>
      ) : (
        <p
          className={`text-xl font-bold tabular-nums text-foreground leading-snug ${truncate ? "truncate" : ""}`}
        >
          {value}
        </p>
      )}
      <p
        className={`text-xs text-muted-foreground ${truncate ? "truncate" : ""}`}
      >
        {sub}
      </p>
    </div>
  );
}
