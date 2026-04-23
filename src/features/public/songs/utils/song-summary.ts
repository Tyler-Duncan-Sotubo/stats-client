import type { PublicSong } from "@/lib/api/public";
import { getChartLabel } from "@/lib/constants/charts";
import { toTitleCase } from "@/shared/utils/format";

export function buildSongSummary(song: PublicSong) {
  const artistName = song.artistName ? toTitleCase(song.artistName) : null;

  const featuredNames = song.features
    .map((f) => f.artistName)
    .filter(Boolean)
    .slice(0, 2)
    .join(" and ");

  const bestChart =
    [...song.charts]
      .filter((c) => c.peakPosition)
      .sort((a, b) => (a.peakPosition ?? 999) - (b.peakPosition ?? 999))[0] ??
    null;

  const releaseYear = song.releaseDate
    ? new Date(song.releaseDate).getFullYear()
    : null;

  // Intro
  const introParts = [
    `"${toTitleCase(song.title)}"`,
    artistName ? `by ${artistName}` : null,
    featuredNames ? `featuring ${featuredNames}` : null,
    releaseYear ? `was released in ${releaseYear}` : null,
    song.totalStreams && Number(song.totalStreams) > 0
      ? `and has accumulated ${
          Number(song.totalStreams) >= 1e9
            ? `over ${(Number(song.totalStreams) / 1e9).toFixed(1)} billion`
            : `${(Number(song.totalStreams) / 1e6).toFixed(0)} million`
        } Spotify streams`
      : null,
  ].filter(Boolean);

  const intro = introParts.join(" ").trim() + ".";

  // Highlights
  const highlights = [
    bestChart?.peakPosition
      ? bestChart.weeksAtNumber1 > 0
        ? `The song peaked at #${bestChart.peakPosition} on the ${getChartLabel(bestChart.chartName)} and spent ${bestChart.weeksAtNumber1} week${bestChart.weeksAtNumber1 > 1 ? "s" : ""} at number one.`
        : `The song peaked at #${bestChart.peakPosition} on the ${getChartLabel(bestChart.chartName)}.`
      : null,
    song.charts.length > 1
      ? `It has appeared on ${song.charts.length} charts in total.`
      : null,
    song.dailyStreams && Number(song.dailyStreams) > 0
      ? `Currently receiving ${(Number(song.dailyStreams) / 1e3).toFixed(0)}K daily streams.`
      : null,
  ].filter(Boolean) as string[];

  const hasContent =
    song.totalStreams ||
    song.dailyStreams ||
    song.charts.length > 0 ||
    highlights.length > 0;

  const metaDescription = hasContent
    ? [intro, highlights[0]].filter(Boolean).join(" ")
    : null;

  return {
    intro,
    highlights,
    metaDescription,
    hasContent: !!hasContent,
  };
}
