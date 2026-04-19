import { CompareView } from "@/features/public/compare/compare-view";
import { Suspense } from "react";
import type { Metadata } from "next";

const BASE_URL = "https://tooxclusive.com/stats";

export const metadata: Metadata = {
  title: "Compare Artists — TooXclusive Stats",
  description:
    "Compare two African or Afrobeats artists head to head. Stream counts, monthly listeners, chart history, awards and more.",
  openGraph: {
    title: "Compare Artists — TooXclusive Stats",
    description:
      "Compare two African or Afrobeats artists head to head. Stream counts, monthly listeners, chart history, awards and more.",
    url: `${BASE_URL}/compare`,
    siteName: "TooXclusive Stats",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tooxclusive",
    title: "Compare Artists — TooXclusive Stats",
    description:
      "Compare two African or Afrobeats artists head to head. Stream counts, monthly listeners, chart history, awards and more.",
  },
  alternates: {
    canonical: `${BASE_URL}/compare`,
  },
};

export default function ComparePage() {
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
