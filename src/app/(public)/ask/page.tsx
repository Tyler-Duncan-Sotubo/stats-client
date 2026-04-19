import { getPopularQuestions, getRecentQuestions } from "@/lib/api/public";
import { AskIndexView } from "@/features/public/ask/ask-index-view";
import type { Metadata } from "next";

const BASE_URL = "https://tooxclusive.com/stats";

export const metadata: Metadata = {
  title: "Ask — TooXclusive Stats",
  description:
    "Ask anything about African and Afrobeats music. Get instant answers on stream counts, chart positions, trending artists and more.",
  openGraph: {
    title: "Ask — TooXclusive Stats",
    description:
      "Ask anything about African and Afrobeats music. Get instant answers on stream counts, chart positions, trending artists and more.",
    url: `${BASE_URL}/ask`,
    siteName: "TooXclusive Stats",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@tooxclusive",
    title: "Ask — TooXclusive Stats",
    description:
      "Ask anything about African and Afrobeats music. Get instant answers on stream counts, chart positions, trending artists and more.",
  },
  alternates: {
    canonical: `${BASE_URL}/ask`,
  },
};

export default async function AskIndexPage() {
  const [popular, recent] = await Promise.all([
    getPopularQuestions(8),
    getRecentQuestions(8),
  ]);

  return <AskIndexView popular={popular} recent={recent} />;
}
