import { NextResponse } from "next/server";

const BASE_URL = "https://tooxclusive.com/stats";
const ARTIST_PAGES = 4;
const SONG_PAGES = 100;
const ALBUM_PAGES = 1;
const MILESTONE_FACT_PAGES = 30;

export async function GET() {
  const now = new Date().toISOString();

  const artistSitemaps = Array.from(
    { length: ARTIST_PAGES },
    (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/artists/${i + 1}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
  ).join("");

  const songSitemaps = Array.from(
    { length: SONG_PAGES },
    (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/songs/${i + 1}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
  ).join("");

  const milestoneSitemap = `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/milestones</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;

  const milestoneFactSitemaps = Array.from(
    { length: MILESTONE_FACT_PAGES },
    (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/milestones-facts/${i + 1}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
  ).join("");

  const milestoneFactsHubSitemap = `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/milestones-facts-hub</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;

  const compareSitemap = `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/compare</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;

  const rankingSitemap = `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/rankings</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`;

  const albumSitemaps = Array.from(
    { length: ALBUM_PAGES },
    (_, i) => `
  <sitemap>
    <loc>${BASE_URL}/sitemaps/albums/${i + 1}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${artistSitemaps}
${songSitemaps}
${albumSitemaps}
${milestoneSitemap}
${milestoneFactSitemaps}
${compareSitemap}
${rankingSitemap}
${milestoneFactsHubSitemap}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
