import { COMPARE_PAGES } from "@/shared/utils/compare";
import { NextResponse } from "next/server";

const BASE_URL = "https://tooxclusive.com/stats";

export async function GET() {
  const urls = [
    // hub
    `<url>
      <loc>${BASE_URL}/compare</loc>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>`,

    // compare pages
    ...COMPARE_PAGES.map(
      ([a, b]) => `
      <url>
        <loc>${BASE_URL}/compare/${a}-vs-${b}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>`,
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
