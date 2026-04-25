// features/public/ranking/ranking-header.tsx
import Link from "next/link";
import Image from "next/image";

interface RankingHeaderProps {
  artistName: string;
  artistSlug: string;
  artistImage: string | null;
  limit: number;
  total: number;
  generatedAt: string;
}

export function RankingHeader({
  artistName,
  artistSlug,
  artistImage,
  limit,
  total,
  generatedAt,
}: RankingHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        {artistImage && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-muted">
            <Image
              src={artistImage}
              alt={artistName}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
            Rankings
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            Top {limit} {artistName} Songs
          </h1>
          <p className="text-sm text-muted-foreground">
            Ranked by Spotify streams · {total} songs
          </p>
        </div>
      </div>
      <Link
        href={`/artists/${artistSlug}`}
        className="text-sm text-primary hover:underline"
      >
        View {artistName} full profile →
      </Link>
    </div>
  );
}
