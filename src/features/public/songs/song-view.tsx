import Link from "next/link";
import Image from "next/image";
import type { PublicSong } from "@/lib/api/public";
import { getSongHistory, getArtistSongs } from "@/lib/api/public";
import { SongStatRow } from "./song-stat-row";
import { SongCharts } from "./song-charts";
import { SongFeatures } from "./song-features";
import { SongSparkline } from "./song-sparkline";
import { ArtistSongsList } from "./artist-songs-list";
import { ChevronLeft } from "lucide-react";
import { formatNumber, toTitleCase } from "@/shared/utils/format";
import { SongSummary } from "./song-summary";
import { ShareButton } from "@/shared/ui/share-button";
import { SongHeader } from "./song-header";

export async function SongView({ song }: { song: PublicSong }) {
  const img = song.imageUrl ?? song.artistImageUrl;

  const [history, artistSongs] = await Promise.all([
    song.slug ? getSongHistory(song.slug).catch(() => []) : Promise.resolve([]),
    song.artistSlug
      ? getArtistSongs(song.artistSlug).catch(() => [])
      : Promise.resolve([]),
  ]);

  const otherSongs = artistSongs.filter((s) => s.slug !== song.slug);

  return (
    <div className="pb-16">
      <SongHeader song={song} />
      {/* Stat row */}
      <div className="space-y-3">
        <SongSummary song={song} />
        <SongStatRow song={song} />
      </div>

      {/* Content */}
      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 flex flex-col gap-8">
          {history.length > 0 && <SongSparkline history={history} />}
          <SongCharts charts={song.charts} />
        </div>

        <div className="min-w-0 flex flex-col gap-6">
          <SongFeatures features={song.features} />
          {otherSongs.length > 0 && (
            <ArtistSongsList
              songs={otherSongs}
              artistName={song.artistName}
              artistSlug={song.artistSlug}
            />
          )}
        </div>
      </div>
    </div>
  );
}
