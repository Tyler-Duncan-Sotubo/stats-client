import Image from "next/image";
import Link from "next/link";
import type { PublicAlbum } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { Disc3 } from "lucide-react";

export function ArtistAlbums({ albums }: { albums: PublicAlbum[] }) {
  if (!albums.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Discography
      </h2>
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/albums/${album.slug}`}
            className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
          >
            {/* Cover */}
            <div className="relative w-10 h-10 shrink-0 rounded-md overflow-hidden bg-muted">
              {album.imageUrl ? (
                <Image
                  src={album.imageUrl}
                  alt={album.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Disc3 className="w-4 h-4 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Title + year */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {album.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {album.albumType}
                {album.releaseDate ? ` · ${album.releaseDate.slice(0, 4)}` : ""}
                {album.totalTracks ? ` · ${album.totalTracks} tracks` : ""}
              </p>
            </div>

            {/* Streams */}
            <div className="text-right shrink-0">
              {album.totalStreams && (
                <p className="text-sm font-semibold tabular-nums text-foreground">
                  {formatNumber(Number(album.totalStreams))}
                </p>
              )}
              {album.dailyStreams && (
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatNumber(Number(album.dailyStreams))}/day
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
