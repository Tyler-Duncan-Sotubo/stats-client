import { redirect } from "next/navigation";
import { CompareView } from "@/features/public/compare/compare-view";
import { Suspense } from "react";
import type { Metadata } from "next";

const BASE_URL = "https://tooxclusive.com/stats";

export const metadata: Metadata = {
  title: "Compare Afrobeats Artists — Streams, Charts & More",
  description:
    "Compare two artists head to head. Streams, monthly listeners, charts, awards and more.",
  alternates: {
    canonical: `${BASE_URL}/compare`,
  },
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ left?: string; right?: string }>;
}) {
  const { left, right } = await searchParams;

  if (left && right) {
    redirect(`/compare/${left}-vs-${right}`);
  }

  return (
    <Suspense
      fallback={
        <div className="h-64 rounded-2xl border border-border bg-muted animate-pulse" />
      }
    >
      <CompareView />
    </Suspense>
  );
}
