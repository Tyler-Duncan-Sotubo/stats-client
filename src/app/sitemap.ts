// app/sitemap.ts
import type { MetadataRoute } from "next";
import {
  getIndexableQuestions,
  getArtists,
  getAvailableCharts,
  getIndexableSongs,
} from "@/lib/api/public";

const BASE_URL = "https://tooxclusive.com/stats";

export const revalidate = 3600; // regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [questions, artists, charts, songs] = await Promise.allSettled([
    getIndexableQuestions(),
    getArtists({ limit: 2000, sortBy: "totalStreams" }),
    getAvailableCharts(),
    getIndexableSongs(), // ← add
  ]);

  console.log(artists.status, charts.status, questions.status, songs.status); // ← add

  // ── Static routes ──────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/ask`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/charts`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/trending`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/artists`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // ── Ask questions ──────────────────────────────────────────────────────────
  const questionRoutes: MetadataRoute.Sitemap =
    questions.status === "fulfilled"
      ? questions.value.map((q) => ({
          url: `${BASE_URL}/ask/${q.slug}`,
          lastModified: new Date(q.updatedAt),
          changeFrequency: "daily" as const,
          priority: 0.7,
        }))
      : [];

  // ── Artist profiles ────────────────────────────────────────────────────────
  const artistRoutes: MetadataRoute.Sitemap =
    artists.status === "fulfilled"
      ? artists.value.data
          .filter((a) => a.slug)
          .map((a) => ({
            url: `${BASE_URL}/artists/${a.slug}`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
          }))
      : [];

  // ── Chart pages ────────────────────────────────────────────────────────────
  const chartRoutes: MetadataRoute.Sitemap =
    charts.status === "fulfilled"
      ? charts.value.map((c) => ({
          url: `${BASE_URL}/charts/${c.chartName}/${c.chartTerritory}`,
          lastModified: new Date(c.latestWeek),
          changeFrequency: "daily" as const,
          priority: 0.8,
        }))
      : [];

  const songRoutes: MetadataRoute.Sitemap =
    songs.status === "fulfilled"
      ? songs.value
          .filter((s) => s.slug)
          .map((s) => ({
            url: `${BASE_URL}/songs/${s.slug}`,
            lastModified: new Date(s.updatedAt),
            changeFrequency: "daily" as const,
            priority: 0.7,
          }))
      : [];

  return [
    ...staticRoutes,
    ...artistRoutes,
    ...songRoutes,
    ...chartRoutes,
    ...questionRoutes,
  ];
}
