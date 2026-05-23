import { getChart } from "@/lib/api/public";
import { AfrobeatsChartCard } from "@/features/public/home/afrobeats-chart-card";
import { headers } from "next/headers";

export default async function AfrobeatsChartEmbedPage() {
  const res = await getChart("tooxclusive_top_100", "NG", 20).catch(() => null);
  const chart = res?.data ?? [];

  // Tell CDN/browser to cache for 1 hour
  const h = await headers();
  // Next.js 15 way to set response headers in a page:
  return (
    <>
      {/* use next/headers in middleware or route handler for headers */}
      <AfrobeatsChartCard tooxclusive={chart} />
    </>
  );
}

export async function generateStaticParams() {
  return [];
}
export const revalidate = 3600; // ISR — rebuilds page every 1 hour
