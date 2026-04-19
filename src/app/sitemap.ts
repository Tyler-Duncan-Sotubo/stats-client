// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getIndexableQuestions, getAvailableCharts } from "@/lib/api/public";

const BASE_URL = "https://tooxclusive.com/stats";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [questions, charts] = await Promise.allSettled([
    getIndexableQuestions(),
    getAvailableCharts(),
  ]);

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

  const questionRoutes: MetadataRoute.Sitemap =
    questions.status === "fulfilled"
      ? questions.value.map((q) => ({
          url: `${BASE_URL}/ask/${q.slug}`,
          lastModified: new Date(q.updatedAt),
          changeFrequency: "daily" as const,
          priority: 0.7,
        }))
      : [];

  const chartRoutes: MetadataRoute.Sitemap =
    charts.status === "fulfilled"
      ? charts.value.map((c) => ({
          url: `${BASE_URL}/charts/${c.chartName}/${c.chartTerritory}`,
          lastModified: new Date(c.latestWeek),
          changeFrequency: "daily" as const,
          priority: 0.8,
        }))
      : [];

  // artists and songs removed — handled by paginated sitemaps
  return [...staticRoutes, ...chartRoutes, ...questionRoutes];
}
