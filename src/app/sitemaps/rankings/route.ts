import { FEATURED_RANKING_ARTISTS } from "@/lib/constants/rankings";
import { NextResponse } from "next/server";

const BASE_URL = "https://tooxclusive.com/stats";
const LIMITS = [10, 20, 50];

export async function GET() {
  const urls = FEATURED_RANKING_ARTISTS.flatMap((artistSlug) =>
    LIMITS.map(
      (limit) =>
        `<url><loc>${BASE_URL}/rankings/top-${limit}-${artistSlug}-songs-by-streams</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`,
    ),
  ).join("\n");

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
