// app/sitemaps/artists/[page]/route.ts
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ page: string }> },
) {
  const { page: pageParam } = await params;
  const page = parseInt(pageParam ?? "1");

  const key = `sitemap:artists:${page}`;
  const cached = await redis.get(key);

  if (!cached) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(cached, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
