// app/sitemaps/route.ts
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const BASE_URL = "https://tooxclusive.com/stats";
const PAGE_SIZE = 5000;

export async function GET() {
  const [songsCount, artistsCount, albumsCount, milestonesCount] =
    await Promise.all([
      redis.get("public:songs:indexable:count"),
      redis.get("public:artists:indexable:count"),
      redis.get("public:albums:indexable:count"),
      redis.get("public:milestones:facts:indexable:count"),
    ]);

  const songPages = Math.ceil(Number(songsCount ?? 0) / PAGE_SIZE);
  const artistPages = Math.ceil(Number(artistsCount ?? 0) / PAGE_SIZE);
  const albumPages = Math.ceil(Number(albumsCount ?? 0) / PAGE_SIZE);
  const milestonePages = Math.ceil(Number(milestonesCount ?? 0) / PAGE_SIZE);

  const now = new Date().toISOString();

  const buildSitemaps = (path: string, pages: number) =>
    Array.from(
      { length: pages },
      (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/${path}/${i + 1}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
    ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${buildSitemaps("artists", artistPages)}
${buildSitemaps("songs", songPages)}
${buildSitemaps("albums", albumPages)}
${buildSitemaps("milestones-facts", milestonePages)}
  <sitemap>
    <loc>${BASE_URL}/sitemaps/milestones</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemaps/compare</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemaps/rankings</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemaps/milestones-facts-hub</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
