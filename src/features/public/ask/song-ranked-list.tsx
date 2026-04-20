import Link from "next/link";
import Image from "next/image";
import { formatNumber } from "@/shared/utils/format";
import { getInitials } from "@/shared/utils/get-initials";

export function SongRankedList({ items }: { items: any[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card mb-6">
      {items.map((item: any, i: number) => {
        const href = item.slug ? `/songs/${item.slug}` : null;

        const content = (
          <div
            className={`flex items-center gap-3 px-4 py-3 ${
              i !== 0 ? "border-t border-border" : ""
            } hover:bg-muted/40 transition-colors`}
          >
            <span className="text-sm text-muted-foreground/40 w-10 tabular-nums shrink-0">
              {item.rank ?? i + 1}
            </span>

            {(item.songImageUrl ?? item.imageUrl) ? (
              <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-muted">
                <Image
                  src={item.songImageUrl ?? item.imageUrl}
                  alt={item.songTitle ?? item.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-muted-foreground">
                  {getInitials(item.songTitle ?? item.title)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.songTitle ?? item.title}
              </p>
              <p className="text-xs text-muted-foreground/50 truncate">
                {item.artistName ?? "—"}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-sm tabular-nums font-medium text-foreground">
                {item.totalStreams
                  ? formatNumber(Number(item.totalStreams))
                  : "—"}
              </p>
              <p className="text-xs text-muted-foreground/40">streams</p>
            </div>
          </div>
        );

        return href ? (
          <Link key={item.songId ?? item.id ?? i} href={href}>
            {content}
          </Link>
        ) : (
          <div key={item.songId ?? item.id ?? i}>{content}</div>
        );
      })}
    </div>
  );
}
