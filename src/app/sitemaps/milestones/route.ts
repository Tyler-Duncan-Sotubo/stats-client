import { NextResponse } from "next/server";

const BASE_URL = "https://tooxclusive.com/stats";

const ARTIST_TIERS = [
  "500-million-streams",
  "1-billion-streams",
  "5-billion-streams",
];
const SONG_TIERS = [
  "100-million-streams",
  "500-million-streams",
  "1-billion-streams",
];

export async function GET() {
  const urls = [
    // Hub
    `<url><loc>${BASE_URL}/milestones</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,

    // Artist tiers
    ...ARTIST_TIERS.map(
      (tier) =>
        `<url><loc>${BASE_URL}/milestones/artists/${tier}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    ),

    // Afrobeats artist tiers
    ...ARTIST_TIERS.map(
      (tier) =>
        `<url><loc>${BASE_URL}/milestones/afrobeats/artists/${tier}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    ),

    // Song tiers
    ...SONG_TIERS.map(
      (tier) =>
        `<url><loc>${BASE_URL}/milestones/songs/${tier}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
    ),
  ].join("\n");

  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
