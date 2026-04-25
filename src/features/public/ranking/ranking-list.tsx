// features/public/ranking/ranking-list.tsx
import Link from "next/link";
import Image from "next/image";
import { formatNumber } from "@/shared/utils/format";
import type { ArtistSong } from "@/lib/api/public";

interface RankingListProps {
  songs: ArtistSong[];
}

function SongAvatar({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string | null;
}) {
  if (imageUrl) {
    return (
      <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
    );
  }

  const initials = title
    .replace(/\(.*?\)/g, "") // strip anything in parentheses e.g. (feat. Tems)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="w-10 h-10 rounded shrink-0 bg-primary/10 flex items-center justify-center">
      <span className="text-xs font-bold text-primary">{initials}</span>
    </div>
  );
}

export function RankingList({ songs }: RankingListProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      {songs.map((song, i) => (
        <div
          key={song.id}
          className={`flex items-center gap-4 px-4 py-3 ${
            i !== 0 ? "border-t border-border" : ""
          } hover:bg-muted/30 transition-colors`}
        >
          {/* Rank */}
          <span className="text-sm font-bold tabular-nums text-muted-foreground/40 w-6 shrink-0 text-right">
            {i + 1}
          </span>

          <SongAvatar title={song.title} imageUrl={song.imageUrl} />

          {/* Title + year */}
          <div className="flex-1 min-w-0">
            {song.slug ? (
              <Link
                href={`/songs/${song.slug}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block"
              >
                {song.title}
              </Link>
            ) : (
              <p className="text-sm font-medium text-foreground truncate">
                {song.title}
              </p>
            )}
            {song.releaseDate && (
              <p className="text-xs text-muted-foreground/50">
                {new Date(song.releaseDate).getFullYear()}
              </p>
            )}
          </div>

          {/* Streams */}
          <div className="text-right shrink-0">
            <p className="text-sm font-bold tabular-nums text-foreground">
              {song.totalStreams
                ? formatNumber(Number(song.totalStreams))
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground/50">streams</p>
          </div>
        </div>
      ))}
    </div>
  );
}
