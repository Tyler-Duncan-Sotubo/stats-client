export const CHART_LABELS: Record<string, string> = {
  official_afrobeats_chart: "UK Afrobeats Chart",
  uk_official_singles: "UK Official Singles",
  billboard_hot_100: "Billboard Hot 100",
  tooxclusive_top_100: "TooXclusive Top 100",
  tooxclusive_east_africa_top_50: "East Africa Top 50",
  spotify_daily_ng: "Spotify Nigeria",
  spotify_daily_za: "Spotify South Africa",
  spotify_daily_gb: "Spotify UK", // ← new
  spotify_daily_global: "Spotify Global", // ← new
  apple_daily_ng: "Apple Music Nigeria",
  apple_daily_gh: "Apple Music Ghana",
  apple_daily_ke: "Apple Music Kenya",
  apple_daily_za: "Apple Music South Africa",
  apple_daily_ug: "Apple Music Uganda",
};

export const CHART_LOGOS: Record<string, string> = {
  official_afrobeats_chart: "/stats/logos/official-charts.png",
  uk_official_singles: "/stats/logos/official-charts.png",
  billboard_hot_100: "/stats/logos/billboard.png",
  tooxclusive_top_100: "/stats/logos/tooxclusive.png",
  tooxclusive_east_africa_top_50: "/stats/logos/tooxclusive.png",
  spotify_daily_ng: "/stats/logos/spotify.png",
  spotify_daily_za: "/stats/logos/spotify.png",
  spotify_daily_gb: "/stats/logos/spotify.png", // ← new
  spotify_daily_global: "/stats/logos/spotify.png", // ← new
  apple_daily_ng: "/stats/logos/apple-music.png",
  apple_daily_gh: "/stats/logos/apple-music.png",
  apple_daily_ke: "/stats/logos/apple-music.png",
  apple_daily_za: "/stats/logos/apple-music.png",
  apple_daily_ug: "/stats/logos/apple-music.png",
};

export const CHART_GROUPS: Record<
  string,
  { name: string; territory: string }[]
> = {
  "African Charts": [
    { name: "tooxclusive_top_100", territory: "NG" },
    { name: "tooxclusive_east_africa_top_50", territory: "EAST_AFRICA" },
    { name: "spotify_daily_ng", territory: "NG" },
    { name: "spotify_daily_za", territory: "ZA" },
    { name: "apple_daily_ng", territory: "NG" },
    { name: "apple_daily_gh", territory: "GH" },
    { name: "apple_daily_ke", territory: "KE" },
    { name: "apple_daily_za", territory: "ZA" },
    { name: "apple_daily_ug", territory: "UG" },
  ],
  "Global Charts": [
    { name: "spotify_daily_global", territory: "GLOBAL" }, // ← new
    { name: "spotify_daily_gb", territory: "GB" }, // ← new
    { name: "official_afrobeats_chart", territory: "UK" },
    { name: "uk_official_singles", territory: "UK" },
    { name: "billboard_hot_100", territory: "US" },
  ],
};

export function getChartLabel(chartName: string): string {
  return (
    CHART_LABELS[chartName] ??
    chartName
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
}
