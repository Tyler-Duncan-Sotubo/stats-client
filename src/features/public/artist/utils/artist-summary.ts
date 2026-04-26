import type { PublicArtist } from "@/lib/api/public";
import { getCountryName } from "@/shared/utils/get-country-name";
import { getChartLabel } from "@/lib/constants/charts";

function formatAudiomackPlays(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

function formatListeners(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}

export function buildArtistSummary(artist: PublicArtist) {
  const country = artist.originCountry
    ? getCountryName(artist.originCountry)
    : null;

  const bestChart =
    artist.charts
      .filter((c) => c.role === "primary" && c.bestPeakPosition)
      .sort(
        (a, b) => (a.bestPeakPosition ?? 999) - (b.bestPeakPosition ?? 999),
      )[0] ?? null;

  const topSong =
    [...artist.topSongs]
      .filter((s) => s.totalStreams)
      .sort(
        (a, b) => Number(b.totalStreams ?? 0) - Number(a.totalStreams ?? 0),
      )[0] ?? null;

  const wonAwards = artist.awards
    .filter((a) => a.result === "won")
    .sort((a, b) => b.year - a.year);

  const rankContext = artist.rankContext;

  // Intro — minimum is just the name
  const introParts = [
    `${artist.name}${country ? ` is an artist from ${country}` : " is a recording artist"}`,
    artist.totalStreams && Number(artist.totalStreams) > 0
      ? `with over ${(Number(artist.totalStreams) / 1e9).toFixed(1)} billion Spotify streams`
      : null,
    artist.monthlyListeners && Number(artist.monthlyListeners) > 0
      ? `and ${(Number(artist.monthlyListeners) / 1e6).toFixed(1)} million monthly listeners`
      : null,
  ].filter(Boolean);

  const intro = introParts.join(" ").trim() + ".";

  const audiomack = artist.audiomackStats;

  // Rank context sentence
  const rankSentence = (() => {
    if (!rankContext?.listenerRank) return null;

    const parts = [
      `${artist.name} is currently ranked #${rankContext.listenerRank} globally on Spotify`,
    ];

    if (
      rankContext.dailyListenersChange &&
      rankContext.dailyListenersChange !== 0
    ) {
      const gained = rankContext.dailyListenersChange > 0;
      parts.push(
        `${gained ? "gaining" : "losing"} ${formatListeners(Math.abs(rankContext.dailyListenersChange))} listeners yesterday`,
      );
    }

    if (rankContext.artistAbove && rankContext.artistBelow) {
      parts.push(
        `ranking above ${rankContext.artistBelow.name} but below ${rankContext.artistAbove.name} this week`,
      );
    }

    return parts.join(" — ") + ".";
  })();

  // Highlights — each is independently optional
  const highlights = [
    rankSentence,
    topSong?.title && topSong?.totalStreams && Number(topSong.totalStreams) > 0
      ? Number(topSong.totalStreams) >= 1e9
        ? `${artist.name}'s most streamed song is "${topSong.title}", with over ${(Number(topSong.totalStreams) / 1e9).toFixed(1)}B streams.`
        : `${artist.name}'s most streamed song is "${topSong.title}", with ${(Number(topSong.totalStreams) / 1e6).toFixed(0)}M streams.`
      : null,
    bestChart?.bestPeakPosition
      ? `${artist.name} peaked at #${bestChart.bestPeakPosition} on the ${getChartLabel(bestChart.chartName)}.`
      : null,
    wonAwards.length > 0
      ? wonAwards.length === 1
        ? `${artist.name} won the ${wonAwards[0].awardName} at the ${wonAwards[0].awardBody}.`
        : `${artist.name} has won ${wonAwards.length} awards including the ${wonAwards[0].awardName} at the ${wonAwards[0].awardBody}.`
      : null,
    audiomack?.totalPlays && Number(audiomack.totalPlays) > 0
      ? `${artist.name} has ${formatAudiomackPlays(Number(audiomack.totalPlays))} plays on Audiomack with ${(Number(audiomack.followers) / 1e6).toFixed(1)}M followers.`
      : null,
  ].filter(Boolean) as string[];

  const hasContent =
    artist.totalStreams || artist.monthlyListeners || highlights.length > 0;

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
