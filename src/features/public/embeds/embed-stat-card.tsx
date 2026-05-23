// features/public/embeds/embed-stat-card.tsx
import type { ChartEntry } from "@/lib/api/public";
import { getTextColors } from "@/shared/utils/get-text-colors";
import { toTitleCase } from "@/shared/utils/format";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ReactNode } from "react";

function Card({
  label,
  value,
  lines = [],
  imageUrl,
  imageAlt,
  href,
  backgroundColor = "#1a1a2e",
  badge,
  className,
}: {
  label: string;
  value: string;
  lines?: string[];
  imageUrl?: string | null;
  imageAlt?: string;
  href: string;
  backgroundColor?: string;
  badge?: ReactNode;
  className?: string;
}) {
  const colors = getTextColors(backgroundColor);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div
        className={cn(
          "relative h-60 w-full overflow-hidden rounded-2xl border px-5 py-6 transition-all",
          "cursor-pointer hover:scale-[1.01] hover:shadow-xl",
          className,
        )}
        style={{ backgroundColor, borderColor: colors.ring }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0.42) 100%)",
          }}
        />

        <div
          className={cn(
            "relative z-10 flex h-full flex-col justify-center",
            imageUrl ? "w-[65%]" : "w-full pr-10",
          )}
        >
          <p
            className="mb-3 text-xs font-bold uppercase leading-none tracking-[0.18em]"
            style={{ color: colors.label }}
          >
            {label}
          </p>
          <p
            className="mb-4 text-2xl font-bold leading-none tabular-nums"
            style={{ color: colors.value }}
          >
            {value}
          </p>
          {badge && <div className="mb-4 text-xs">{badge}</div>}
          <div className="flex flex-col gap-2">
            {lines.map((line, i) => (
              <p
                key={i}
                className="leading-snug"
                style={{
                  color: i === 0 ? colors.secondary : colors.muted,
                  fontSize: i === 0 ? "1.1rem" : "0.8rem",
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {imageUrl ? (
          <div className="absolute right-5 top-1/2 z-10 flex w-[30%] -translate-y-1/2 items-center justify-center">
            <div
              className="h-28 w-28 shrink-0 overflow-hidden rounded-full"
              style={{ boxShadow: `0 0 0 2px ${colors.ring}` }}
            >
              <Image
                src={imageUrl}
                alt={imageAlt ?? label}
                width={112}
                height={112}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        ) : (
          <div
            className="absolute right-5 top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.fallback,
              boxShadow: `0 0 0 1px ${colors.ring}`,
            }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: colors.muted }}
            >
              {value[0]}
            </span>
          </div>
        )}
      </div>
    </a>
  );
}

// --- Afrobeats ---

interface EmbedAfrobeatsCardProps {
  tooxclusive: ChartEntry[];
}

export function EmbedAfrobeatsCard({ tooxclusive }: EmbedAfrobeatsCardProps) {
  const top1 = tooxclusive.find((e) => e.position === 1);
  const uniqueArtists = new Set(tooxclusive.map((e) => e.artistId)).size;

  const top10Artists = tooxclusive
    .filter((e) => e.position <= 10)
    .map((e) => toTitleCase(e.artistName))
    .filter((name, i, arr) => arr.indexOf(name) === i)
    .slice(0, 2)
    .join(", ");

  const chartDate = top1?.chartWeek
    ? new Date(top1.chartWeek).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      })
    : null;

  const badge = chartDate ? (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-orange-300/20 px-2.5 py-1 text-xs font-semibold text-orange-100 ring-1 ring-orange-200/20">
      <span>Week of {chartDate}</span>
    </span>
  ) : null;

  return (
    <Card
      label="Afrobeats #1"
      value={top1 ? toTitleCase(top1.songTitle) : "—"}
      lines={
        [
          top1?.artistName ? toTitleCase(top1.artistName) : null,
          top10Artists ? `Top 10: ${top10Artists}...` : null,
          `${uniqueArtists} artists charting`,
        ].filter(Boolean) as string[]
      }
      badge={badge}
      imageUrl={top1?.artistImageUrl}
      imageAlt={top1?.artistName}
      href="https://tooxclusive.com/stats/charts/tooxclusive_top_100/NG"
      backgroundColor="#0C1A2E"
    />
  );
}

// --- Spotify ---

interface EmbedSpotifyCardProps {
  spotify: ChartEntry[];
}

export function EmbedSpotifyCard({ spotify }: EmbedSpotifyCardProps) {
  const top1 = spotify[0] ?? null;

  const badge = (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-green-300/20 px-2.5 py-1 text-xs font-semibold text-green-100 ring-1 ring-green-200/20">
      <span>Daily · Nigeria</span>
    </span>
  );

  return (
    <Card
      label="Spotify Nigeria #1"
      value={top1 ? toTitleCase(top1.songTitle) : "—"}
      lines={
        [top1?.artistName ? toTitleCase(top1.artistName) : null].filter(
          Boolean,
        ) as string[]
      }
      badge={badge}
      imageUrl={top1?.artistImageUrl}
      imageAlt={top1?.artistName}
      href="https://tooxclusive.com/stats/charts/spotify_daily_ng/NG"
      backgroundColor="#1DB954"
    />
  );
}
