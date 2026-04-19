// app/sitemap-index.xml/route.ts
import { NextResponse } from "next/server";

const BASE_URL = "https://tooxclusive.com/stats";
const ARTIST_PAGES = 4; // 20k artists at 5k per page
const SONG_PAGES = 100; // 1M songs at 10k per page

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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${artistSitemaps}
${songSitemaps}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
