import { getArtist } from "@/lib/api/public";
import { CompareView } from "@/features/public/compare/compare-view";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";

const BASE_URL = "https://tooxclusive.com/stats";

// ── helper: parse slug ─────────────────────────

function parseSlug(slug: string) {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return null;

  const [a, b] = parts;

  if (!a || !b) return null;

  return [a, b] as const;
}

// ── SEO metadata ─────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const parsed = parseSlug(slug);
  if (!parsed) return {};

  const [aSlug, bSlug] = parsed;

  const a = await getArtist(aSlug);
  const b = await getArtist(bSlug);

  if (!a || !b) return {};

  const title = `${a.name} vs ${b.name} — Compare Streams, Charts & Stats`;
  const description = `Compare ${a.name} and ${b.name}: streams, monthly listeners, chart history, awards and more on TooXclusive Stats.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/compare/${a.slug}-vs-${b.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/compare/${a.slug}-vs-${b.slug}`,
      siteName: "TooXclusive Stats",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@tooxclusive",
    },
  };
}

// ── Page ─────────────────────────────────────

export default async function CompareSeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const parsed = parseSlug(slug);
  if (!parsed) {
    notFound();
  }

  let [aSlug, bSlug] = parsed!;

  // enforce alphabetical canonical
  const [a, b] = [aSlug, bSlug].sort();

  if (slug !== `${a}-vs-${b}`) {
    redirect(`/compare/${a}-vs-${b}`);
  }

  const [left, right] = await Promise.all([
    getArtist(a).catch(() => null),
    getArtist(b).catch(() => null),
  ]);

  if (!left || !right) {
    notFound();
  }

  return <CompareView initialLeft={left} initialRight={right} />;
}
