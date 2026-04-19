// features/public/compare/compare-embed-view.tsx
"use client";

import Image from "next/image";
import { formatNumber } from "@/shared/utils/format";
import type { PublicArtist } from "@/lib/api/public";

interface Props {
  left: PublicArtist | null;
  right: PublicArtist | null;
}

const STATS = [
  {
    label: "Total Streams",
    key: "totalStreams" as keyof PublicArtist,
  },
  {
    label: "Monthly Listeners",
    key: "monthlyListeners" as keyof PublicArtist,
  },
  {
    label: "Daily Streams",
    key: "dailyStreams" as keyof PublicArtist,
  },
];

function ArtistHeader({ artist }: { artist: PublicArtist }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
        {artist.imageUrl ? (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xl font-bold text-muted-foreground/30">
              {artist.name[0]}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{artist.name}</p>
        {artist.originCountry && (
          <p className="text-xs text-muted-foreground">
            {artist.originCountry}
          </p>
        )}
      </div>
    </div>
  );
}

function StatRow({
  label,
  leftValue,
  rightValue,
}: {
  label: string;
  leftValue: number | null;
  rightValue: number | null;
}) {
  const left = Number(leftValue ?? 0);
  const right = Number(rightValue ?? 0);
  const leftWins = left > right;
  const rightWins = right > left;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-2.5 border-t border-border">
      <p
        className={`text-sm tabular-nums text-right font-medium ${
          leftWins ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {leftValue ? formatNumber(left) : "—"}
      </p>
      <p className="text-xs text-muted-foreground/50 text-center w-28 shrink-0">
        {label}
      </p>
      <p
        className={`text-sm tabular-nums text-left font-medium ${
          rightWins ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {rightValue ? formatNumber(right) : "—"}
      </p>
    </div>
  );
}

export function CompareEmbedView({ left, right }: Props) {
  const BASE_URL = "https://tooxclusive.com/stats";

  if (!left && !right) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
        No artists selected
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Artist headers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          {left ? (
            <ArtistHeader artist={left} />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-muted" />
              <p className="text-xs text-muted-foreground">—</p>
            </div>
          )}
        </div>
        <div>
          {right ? (
            <ArtistHeader artist={right} />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-muted" />
              <p className="text-xs text-muted-foreground">—</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div>
        {STATS.map((stat) => (
          <StatRow
            key={stat.label}
            label={stat.label}
            leftValue={left?.[stat.key] as number | null}
            rightValue={right?.[stat.key] as number | null}
          />
        ))}
      </div>

      {/* Footer — powered by + link */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground/40">
          Powered by{" "}
          <a
            href={BASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            TooXclusive Stats
          </a>
        </p>
        {left && right && (
          <a
            href={`${BASE_URL}/compare?left=${left.slug}&right=${right.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Full comparison →
          </a>
        )}
      </div>
    </div>
  );
}
