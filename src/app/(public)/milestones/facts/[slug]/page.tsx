import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import {
  getArtistStreamFact,
  getArtistListenerFact,
  getSongStreamFact,
} from "@/lib/api/public";
import { MilestoneFactView } from "@/features/public/milestones/milestone-fact-view";
import type { MilestoneFact } from "@/lib/api/public";

const BASE_URL = "https://tooxclusive.com/stats";

interface Props {
  params: Promise<{ slug: string }>;
}

// ── Slug parser ───────────────────────────────────────────────────────────────

function parseThreshold(part: string): number {
  const match = part.match(/^(\d+)(b|m|k)?$/i);
  if (!match) return 0;
  const num = parseInt(match[1]);
  const unit = match[2]?.toLowerCase();
  if (unit === "b") return num * 1_000_000_000;
  if (unit === "m") return num * 1_000_000;
  if (unit === "k") return num * 1_000;
  return num;
}

interface ParsedSlug {
  artistSlug: string;
  songSlug?: string;
  metric: "spotify_streams" | "monthly_listeners";
  threshold: number;
}

function parseFactSlug(slug: string): ParsedSlug | null {
  // monthly listeners: wizkid-50m-monthly-listeners-spotify
  const listenerMatch = slug.match(
    /^(.+?)-(\d+(?:b|m|k)?)-monthly-listeners-spotify$/i,
  );
  if (listenerMatch) {
    return {
      artistSlug: listenerMatch[1],
      metric: "monthly_listeners",
      threshold: parseThreshold(listenerMatch[2]),
    };
  }

  // artist streams: wizkid-10b-streams-spotify
  const artistMatch = slug.match(/^(.+?)-(\d+(?:b|m|k)?)-streams-spotify$/i);
  if (artistMatch) {
    // Could be artist or song — try to detect song by checking
    // if the part before threshold contains a known song pattern
    // We'll try artist first, fall back to song in the fetch
    return {
      artistSlug: artistMatch[1],
      metric: "spotify_streams",
      threshold: parseThreshold(artistMatch[2]),
    };
  }

  return null;
}

// ── Fetch fact ────────────────────────────────────────────────────────────────

async function fetchFact(slug: string): Promise<MilestoneFact | null> {
  const parsed = parseFactSlug(slug);
  if (!parsed) return null;

  const { artistSlug, metric, threshold } = parsed;

  try {
    if (metric === "monthly_listeners") {
      return await getArtistListenerFact(artistSlug, threshold);
    }

    // Try artist first
    const artistFact = await getArtistStreamFact(artistSlug, threshold).catch(
      () => null,
    );

    if (artistFact) return artistFact;

    // If artist not found — could be a song slug
    // Split artistSlug to try artist + song combinations
    const parts = artistSlug.split("-");
    for (let i = 1; i < parts.length; i++) {
      const tryArtist = parts.slice(0, i).join("-");
      const trySong = parts.slice(i).join("-");
      const songFact = await getSongStreamFact(
        tryArtist,
        trySong,
        threshold,
      ).catch(() => null);
      if (songFact?.songId) return songFact;
    }

    return null;
  } catch {
    return null;
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const fact = await fetchFact(slug);

  if (!fact) return {};

  const threshold = formatThreshold(fact.threshold);
  const metric =
    fact.metric === "monthly_listeners" ? "monthly listeners" : "streams";

  const title = fact.songId
    ? `"${fact.songTitle}" by ${fact.artistName} hits ${threshold} ${metric} on Spotify | TooXclusive Stats`
    : `${fact.artistName} hits ${threshold} ${metric} on Spotify | TooXclusive Stats`;

  const description = fact.songId
    ? `"${fact.songTitle}" by ${fact.artistName} has crossed ${threshold} ${metric} on Spotify as of ${new Date(fact.crossedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`
    : `${fact.artistName} has crossed ${threshold} ${metric} on Spotify as of ${new Date(fact.crossedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`;

  const image = fact.songImageUrl ?? fact.artistImageUrl ?? null;
  const url = `${BASE_URL}/milestones/facts/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "TooXclusive Stats",
      type: "article",
      ...(image && {
        images: [{ url: image, width: 640, height: 640, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@tooxclusive",
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: { canonical: url },
  };
}

// ── Schema ────────────────────────────────────────────────────────────────────

function FactSchema({ fact, slug }: { fact: MilestoneFact; slug: string }) {
  const threshold = formatThreshold(fact.threshold);
  const metric =
    fact.metric === "monthly_listeners" ? "monthly listeners" : "streams";

  const name = fact.songId
    ? `"${fact.songTitle}" by ${fact.artistName} hits ${threshold} ${metric} on Spotify`
    : `${fact.artistName} hits ${threshold} ${metric} on Spotify`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: name,
    datePublished: fact.crossedAt,
    dateModified: fact.crossedAt,
    url: `${BASE_URL}/milestones/facts/${slug}`,
    publisher: {
      "@type": "Organization",
      name: "TooXclusive Stats",
      url: BASE_URL,
    },
    about: {
      "@type": fact.songId ? "MusicRecording" : "MusicGroup",
      name: fact.songId ? fact.songTitle : fact.artistName,
      ...(fact.spotifyId &&
        !fact.songId && {
          sameAs: `https://open.spotify.com/artist/${fact.spotifyId}`,
        }),
      ...(fact.spotifyTrackId && {
        sameAs: `https://open.spotify.com/track/${fact.spotifyTrackId}`,
      }),
    },
  };

  return (
    <Script
      id="schema-milestone-fact"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatThreshold(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MilestoneFactPage({ params }: Props) {
  const { slug } = await params;
  const fact = await fetchFact(slug);

  if (!fact) notFound();

  return (
    <>
      <FactSchema fact={fact} slug={slug} />
      <MilestoneFactView fact={fact} />
    </>
  );
}
