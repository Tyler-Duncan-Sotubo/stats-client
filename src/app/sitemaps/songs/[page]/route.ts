// app/sitemaps/songs/[page]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getIndexableSongs } from "@/lib/api/public";

const BASE_URL = "https://tooxclusive.com/stats";
const PAGE_SIZE = 5000;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page: pageParam } = await params;
  const page = parseInt(pageParam ?? "1");
  const offset = (page - 1) * PAGE_SIZE;

  const songs = await getIndexableSongs(PAGE_SIZE, offset);

  if (!songs?.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const urls = songs
    .filter((s) => s.slug)
    .map((s) => {
      const streams = Number(s.totalStreams ?? 0);
      const priority =
        streams >= 1_000_000_000
          ? "0.9"
          : streams >= 100_000_000
            ? "0.8"
            : streams >= 10_000_000
              ? "0.7"
              : "0.6";

      return `
  <url>
    <loc>${BASE_URL}/songs/${s.slug}</loc>
    <lastmod>${new Date(s.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
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
