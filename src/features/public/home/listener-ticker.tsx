"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatNumber } from "@/shared/utils/format";
import type { LeaderboardEntry } from "@/lib/api/public";

interface ListenerTickerProps {
  artists: LeaderboardEntry[];
}

function TrendIcon({ change }: { change: number | null | undefined }) {
  if (!change || change === 0)
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  if (change > 0) return <TrendingUp className="w-3 h-3 text-emerald-500" />;
  return <TrendingDown className="w-3 h-3 text-rose-500" />;
}

export function ListenerTicker({ artists }: ListenerTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const items = [...artists, ...artists];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animFrame: number;
    let pos = 0;
    const speed = 0.5;
    const halfWidth = track.scrollWidth / 2;

    function tick() {
      pos += speed;
      if (pos >= halfWidth) pos = 0;
      if (track) track.style.transform = `translateX(-${pos}px)`;
      animFrame = requestAnimationFrame(tick);
    }

    animFrame = requestAnimationFrame(tick);

    const pause = () => cancelAnimationFrame(animFrame);
    const resume = () => {
      animFrame = requestAnimationFrame(tick);
    };
    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animFrame);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <div className="border-y border-border bg-background overflow-hidden">
      {/* Header strip */}
      <div className="flex items-center gap-3 px-4 py-1.5 border-b border-border bg-muted/30">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Spotify Monthly Listeners
        </span>
        <span className="text-xs text-muted-foreground/50">
          Nigeria · Top 10
        </span>
      </div>

      {/* Ticker */}
      <div className="relative overflow-hidden py-2">
        <div ref={trackRef} className="flex gap-3 w-max">
          {items.map((artist, i) => (
            <Link
              key={`${artist.artistId}-${i}`}
              href={`/artists/${artist.artistSlug}`}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors shrink-0 ${i === 0 ? "border-l border-border" : ""}`}
            >
              {/* Rank */}
              <span className="text-base font-bold text-muted-foreground/40 w-4 tabular-nums text-right">
                {(i % artists.length) + 1}
              </span>

              {/* Avatar */}
              {artist.artistImageUrl ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-muted">
                  <Image
                    src={artist.artistImageUrl}
                    alt={artist.artistName ?? ""}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted shrink-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground capitalize">
                    {artist.artistName?.[0]}
                  </span>
                </div>
              )}

              {/* Name + listeners */}
              <div>
                <p className="text-base font-semibold text-foreground leading-none capitalize">
                  {artist.artistName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendIcon change={artist.dailyChange} />
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {artist.monthlyListeners
                      ? formatNumber(Number(artist.monthlyListeners))
                      : "—"}
                  </span>
                  {artist.dailyChange && artist.dailyChange !== 0 && (
                    <span
                      className={`text-sm tabular-nums ${
                        artist.dailyChange > 0
                          ? "text-emerald-500"
                          : "text-rose-500"
                      }`}
                    >
                      {artist.dailyChange > 0 ? "+" : ""}
                      {formatNumber(Math.abs(artist.dailyChange))}
                    </span>
                  )}
                </div>
              </div>

              {/* Global rank */}
              {artist.globalRank && (
                <div className="px-1.5 py-0.5 rounded bg-muted/60 shrink-0">
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                    #{artist.globalRank} 🌍
                  </span>
                </div>
              )}

              <span className="text-border ml-1">·</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
