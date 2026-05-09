import Image from "next/image";
import Link from "next/link";
import type { PublicAlbum } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { Disc3 } from "lucide-react";

export function AlbumCard({
  album,
  sortBy = "totalStreams",
}: {
  album: PublicAlbum;
  sortBy?: string;
}) {
  return (
    <Link
      href={`/albums/${album.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-3 hover:shadow-lg transition-all duration-200 hover:border-border/60 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative mb-3 w-full aspect-square overflow-hidden rounded-lg bg-muted ring-1 ring-border/50 group-hover:ring-primary/20 transition-all duration-200">
        {album.imageUrl ? (
          <Image
            src={album.imageUrl}
            alt={album.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Disc3 className="w-10 h-10 text-muted-foreground/20" />
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-sm font-bold text-foreground leading-tight line-clamp-1 mb-0.5">
        {album.title}
      </p>

      {/* Artist */}
      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
        {album.artistName}
      </p>

      {/* Stat */}
      {sortBy === "releaseDate" && album.releaseDate ? (
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {album.releaseDate.slice(0, 4)}
          {album.totalTracks ? ` · ${album.totalTracks} tracks` : ""}
        </p>
      ) : sortBy === "dailyStreams" && album.dailyStreams ? (
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {formatNumber(album.dailyStreams)}/day
        </p>
      ) : album.totalStreams ? (
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {formatNumber(album.totalStreams)} streams
        </p>
      ) : album.releaseDate ? (
        <p className="text-xs font-semibold text-muted-foreground tabular-nums">
          {album.releaseDate.slice(0, 4)}
        </p>
      ) : null}
    </Link>
  );
}
