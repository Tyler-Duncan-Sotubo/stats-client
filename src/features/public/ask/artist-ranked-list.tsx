import Link from "next/link";
import Image from "next/image";
import { formatNumber } from "@/shared/utils/format";

function getInitials(text?: string) {
  if (!text) return "?";
  return text
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function ArtistRankedList({
  items,
  toolUsed,
}: {
  items: any[];
  toolUsed: string;
}) {
  const isTrending = toolUsed.startsWith("get_trending");

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card mb-6">
      {items.map((item: any, i: number) => {
        const href =
          (item.artistSlug ?? item.slug)
            ? `/artists/${item.artistSlug ?? item.slug}`
            : null;

        const artistName = item.artistName ?? item.name;
        const imageSrc = item.artistImageUrl ?? item.imageUrl;

        const content = (
          <div
            className={`flex items-center gap-3 px-4 py-3 ${
              i !== 0 ? "border-t border-border" : ""
            } hover:bg-muted/40 transition-colors cursor-pointer`}
          >
            <span className="text-sm text-muted-foreground/40 w-10 tabular-nums shrink-0">
              {item.rank ?? i + 1}
            </span>

            {imageSrc ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 bg-muted">
                <Image
                  src={imageSrc}
                  alt={artistName}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {getInitials(artistName)}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {artistName}
              </p>
              {item.originCountry && (
                <p className="text-xs text-muted-foreground/50">
                  {item.originCountry}
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm tabular-nums font-medium text-foreground">
                {isTrending
                  ? item.dailyGrowth
                    ? `+${formatNumber(Number(item.dailyGrowth))}`
                    : "—"
                  : item.totalStreams
                    ? formatNumber(Number(item.totalStreams))
                    : item.monthlyListeners
                      ? formatNumber(Number(item.monthlyListeners))
                      : "—"}
              </p>
              <p className="text-xs text-muted-foreground/40">
                {isTrending
                  ? "daily growth"
                  : item.monthlyListeners
                    ? "listeners"
                    : "streams"}
              </p>
            </div>
          </div>
        );

        return href ? (
          <Link key={item.artistId ?? item.id ?? i} href={href}>
            {content}
          </Link>
        ) : (
          <div key={item.artistId ?? item.id ?? i}>{content}</div>
        );
      })}
    </div>
  );
}
