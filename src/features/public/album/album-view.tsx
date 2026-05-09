import type { FullAlbum } from "@/lib/api/public";
import { AlbumTracklist } from "./album-tracklist";
import { AlbumHeader } from "./album-header";

export function AlbumView({ data }: { data: FullAlbum }) {
  const { album, tracklist } = data;

  return (
    <div className="pb-16">
      <AlbumHeader album={album} tracklist={tracklist} />
      <AlbumTracklist tracks={tracklist} />
    </div>
  );
}
