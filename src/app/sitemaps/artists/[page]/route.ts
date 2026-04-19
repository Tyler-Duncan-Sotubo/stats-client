import { NextRequest, NextResponse } from "next/server";
import { getIndexableArtists } from "@/lib/api/public";

const BASE_URL = "https://tooxclusive.com/stats";
const PAGE_SIZE = 5000;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page: pageParam } = await params; // ← await params
  const page = parseInt(pageParam ?? "1");
  const offset = (page - 1) * PAGE_SIZE;

  const artists = await getIndexableArtists(PAGE_SIZE, offset);

  if (!artists?.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const urls = artists
    .filter((a) => a.slug)
    .map(
      (a) => `
  <url>
    <loc>${BASE_URL}/artists/${a.slug}</loc>
    <lastmod>${new Date(a.updatedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
