import { redirect } from "next/navigation";
import {
  askQuestion,
  getPopularQuestions,
  getRecentQuestions,
} from "@/lib/api/public";
import { AskView } from "@/features/public/ask/ask-view";
import type { Metadata } from "next";
import { toTitleCase } from "@/shared/utils/format";

const BASE_URL = "https://tooxclusive.com/stats";

interface AskPageProps {
  params: Promise<{ slug: string[] }>;
}

function reconstructQuestion(slug: string[]): string {
  return slug.join("-").replace(/-/g, " ").trim();
}

export async function generateMetadata({
  params,
}: AskPageProps): Promise<Metadata> {
  const { slug } = await params;
  const question = reconstructQuestion(slug);
  const canonical = `${BASE_URL}/ask/${slug.join("/")}`;

  let description = `Get the answer to "${toTitleCase(question)}" — African and Afrobeats music statistics powered by TooXclusive Stats.`;

  try {
    const result = await askQuestion(question);
    if (result.answer && !result.answer.includes("couldn't find")) {
      description = result.answer;
    }
  } catch {
    // use default description
  }

  return {
    title: `${toTitleCase(question)} — TooXclusive Stats`,
    description,
    openGraph: {
      title: `${toTitleCase(question)} — TooXclusive Stats`,
      description,
      url: canonical,
      siteName: "TooXclusive Stats",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      site: "@tooxclusive",
      title: `${toTitleCase(question)} — TooXclusive Stats`,
      description,
    },
    alternates: {
      canonical,
    },
  };
}

export default async function AskPage({ params }: AskPageProps) {
  const { slug } = await params;

  if (!slug?.length) redirect("/");

  const question = reconstructQuestion(slug);

  const [result, popular, recent] = await Promise.all([
    askQuestion(question),
    getPopularQuestions(6),
    getRecentQuestions(6),
  ]);

  // ── Comparison redirect — updated for new toolUsed format ──
  if (
    result.toolUsed === "comparison" ||
    result.toolUsed === "get_artist:comparison"
  ) {
    const left = result.data?.artist1?.slug;
    const right = result.data?.artist2?.slug;
    if (left && right) {
      redirect(`/compare/${left}-vs-${right}`);
    }
  }

  return (
    <AskView
      question={question}
      result={result}
      popular={popular}
      recent={recent}
    />
  );
}
