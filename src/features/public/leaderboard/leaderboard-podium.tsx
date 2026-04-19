import Image from "next/image";
import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/api/public";
import { Crown } from "lucide-react";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
  valueKey: "totalStreams" | "monthlyListeners";
  labelKey: "artistName" | "songTitle";
  slugKey: "artistSlug" | "songSlug";
  imageKey: "artistImageUrl" | "songImageUrl";
  hrefPrefix: "/artists" | "/songs";
  valueLabel: string;
}

const PODIUM_ORDER = [1, 0, 2]; // show 2nd, 1st, 3rd
const PODIUM_HEIGHTS = ["h-28", "h-36", "h-24"];
const PODIUM_COLORS = [
  "bg-slate-100 dark:bg-slate-800",
  "bg-amber-50 dark:bg-amber-900/20",
  "bg-orange-50 dark:bg-orange-900/20",
];
const PODIUM_BADGES = [
  { bg: "bg-slate-400", text: "2" },
  { bg: "bg-amber-400", text: "1" },
  { bg: "bg-orange-400", text: "3" },
];

export function LeaderboardPodium({
  entries,
  valueKey,
  labelKey,
  slugKey,
  imageKey,
  hrefPrefix,
  valueLabel,
}: LeaderboardPodiumProps) {
  const top3 = entries.slice(0, 3);
  if (top3.length < 3) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8 items-end">
      {PODIUM_ORDER.map((index, position) => {
        const entry = top3[index];
        const name = entry[labelKey] as string;
        const slug = entry[slugKey] as string | null;
        const imageUrl = entry[imageKey] as string | null;
        const value = entry[valueKey] as number | null;
        const isFirst = index === 0;

        return (
          <Link
            key={entry.rank}
            href={slug ? `${hrefPrefix}/${slug}` : "#"}
            className="group flex flex-col items-center"
          >
            {/* Crown for #1 */}
            {isFirst && (
              <Crown className="w-6 h-6 text-amber-400 mb-2 animate-bounce" />
            )}

            {/* Card */}
            <div
              className={`w-full rounded-2xl border border-border overflow-hidden ${PODIUM_COLORS[position]} transition-all hover:shadow-lg hover:-translate-y-1`}
            >
              {/* Image */}
              <div
                className={`relative w-full ${PODIUM_HEIGHTS[position]} bg-muted`}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-4xl font-black text-muted-foreground/20">
                      {name?.[0]}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Rank badge */}
                <div
                  className={`absolute top-3 left-3 ${PODIUM_BADGES[position].bg} rounded-full w-7 h-7 flex items-center justify-center`}
                >
                  <span className="text-xs font-black text-white">
                    {PODIUM_BADGES[position].text}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="px-4 py-3">
                <p className="text-sm font-bold text-foreground truncate">
                  {toTitleCase(name)}
                </p>
                {entry.originCountry && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getCountryName(entry.originCountry)}
                  </p>
                )}
                <p className="text-base font-black tabular-nums text-foreground mt-1">
                  {value ? formatNumber(value) : "—"}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  {valueLabel}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
