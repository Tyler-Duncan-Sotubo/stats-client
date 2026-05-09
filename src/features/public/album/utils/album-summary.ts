// features/public/album/utils/album-summary.ts
import type { PublicAlbum, PublicAlbumTrack } from "@/lib/api/public";

function formatNumber(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

export function buildAlbumSummary(
  album: PublicAlbum,
  tracklist: PublicAlbumTrack[],
) {
  // Intro
  const introParts = [
    `${album.title} is ${album.albumType === "single" ? "a single" : album.albumType === "ep" ? "an EP" : "an album"} by ${album.artistName}`,
    album.releaseDate ? `released in ${album.releaseDate.slice(0, 4)}` : null,
    album.totalStreams && Number(album.totalStreams) > 0
      ? `with ${formatNumber(Number(album.totalStreams))} Spotify streams`
      : null,
  ].filter(Boolean);

  const intro = introParts.join(" ") + ".";

  // Most streamed track
  const topTrack =
    [...tracklist]
      .filter((t) => t.totalStreams)
      .sort(
        (a, b) => Number(b.totalStreams ?? 0) - Number(a.totalStreams ?? 0),
      )[0] ?? null;

  // Highlights
  const highlights = [
    topTrack?.title && topTrack?.totalStreams
      ? `The most streamed track is "${topTrack.title}" with ${formatNumber(Number(topTrack.totalStreams))} streams.`
      : null,
    album.totalTracks
      ? `The ${album.albumType} contains ${album.totalTracks} track${album.totalTracks === 1 ? "" : "s"}.`
      : null,
    album.dailyStreams && Number(album.dailyStreams) > 0
      ? `${album.title} is currently generating ${formatNumber(Number(album.dailyStreams))} daily streams.`
      : null,
  ].filter(Boolean) as string[];

  const metaDescription = [intro, highlights[0]].filter(Boolean).join(" ");

  return { intro, highlights, metaDescription };
}
