import type { Metadata } from "next";
import { getMilestoneCounts } from "@/lib/api/public";
import { MilestonesHubView } from "@/features/public/milestones/milestones-hub-view";

const BASE_URL = "https://tooxclusive.com/stats";

export const metadata: Metadata = {
  title: "Spotify Stream Milestones — TooXclusive Stats",
  description:
    "Artists and songs that have hit major Spotify streaming milestones. 1 billion streams, 500 million streams and more.",
  alternates: { canonical: `${BASE_URL}/milestones` },
  openGraph: {
    title: "Spotify Stream Milestones — TooXclusive Stats",
    description:
      "Artists and songs that have hit major Spotify streaming milestones.",
    url: `${BASE_URL}/milestones`,
    siteName: "TooXclusive Stats",
    type: "website",
  },
};

export default async function MilestonesPage() {
  const counts = await getMilestoneCounts();
  return <MilestonesHubView counts={counts} />;
}
