import { getChartCached } from "@/lib/api/public";
import { ChartEmbedView } from "@/features/public/charts/chart-embed-view";

export const revalidate = 1800; // 30 mins

interface Props {
  params: Promise<{ chartName: string; territory: string }>;
  searchParams: Promise<{ limit?: string }>;
}

export default async function ChartEmbedPage({ params, searchParams }: Props) {
  const { chartName, territory } = await params;
  const { limit } = await searchParams;

  const data = await getChartCached(
    chartName,
    territory,
    Math.min(Number(limit ?? 10), 10), // hard cap at 10
    1800,
  ).catch(() => null);

  return (
    <ChartEmbedView data={data} chartName={chartName} territory={territory} />
  );
}
