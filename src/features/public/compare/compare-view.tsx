"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { compareSuggestArtist } from "@/lib/api/public";
import type { PublicArtist, BrowseArtist } from "@/lib/api/public";
import { ArtistSearch } from "./artist-search";
import { CompareArtistCard } from "./compare-artist-card";
import { CompareStatRow } from "./compare-stat-row";
import { CompareScoreCard } from "./compare-score-card";
import { GitCompare, Share2, Check } from "lucide-react";

export function CompareView({
  initialLeft,
  initialRight,
}: {
  initialLeft?: PublicArtist | null;
  initialRight?: PublicArtist | null;
}) {
  const router = useRouter();

  const [leftBrowse, setLeftBrowse] = useState<BrowseArtist | null>(
    initialLeft
      ? {
          id: initialLeft.id,
          name: initialLeft.name,
          slug: initialLeft.slug,
          imageUrl: initialLeft.imageUrl,
          originCountry: initialLeft.originCountry,
          isAfrobeats: initialLeft.isAfrobeats,
          totalStreams: initialLeft.totalStreams,
          monthlyListeners: initialLeft.monthlyListeners,
        }
      : null,
  );

  const [rightBrowse, setRightBrowse] = useState<BrowseArtist | null>(
    initialRight
      ? {
          id: initialRight.id,
          name: initialRight.name,
          slug: initialRight.slug,
          imageUrl: initialRight.imageUrl,
          originCountry: initialRight.originCountry,
          isAfrobeats: initialRight.isAfrobeats,
          totalStreams: initialRight.totalStreams,
          monthlyListeners: initialRight.monthlyListeners,
        }
      : null,
  );

  const [leftArtist, setLeftArtist] = useState<PublicArtist | null>(
    initialLeft ?? null,
  );
  const [rightArtist, setRightArtist] = useState<PublicArtist | null>(
    initialRight ?? null,
  );

  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── URL updater (NEW SEO ROUTE) ─────────────────────────────

  function updateUrl(leftSlug?: string | null, rightSlug?: string | null) {
    if (!leftSlug || !rightSlug) return;

    // enforce alphabetical canonical
    const [a, b] =
      leftSlug < rightSlug ? [leftSlug, rightSlug] : [rightSlug, leftSlug];

    router.replace(`/compare/${a}-vs-${b}`, { scroll: false });
  }

  // ── Select handlers ─────────────────────────────────────────

  async function selectLeft(artist: BrowseArtist) {
    setLeftBrowse(artist);
    if (!artist.slug) return;

    setLeftLoading(true);
    try {
      const full = await compareSuggestArtist(artist.slug);
      setLeftArtist(full);
      updateUrl(artist.slug, rightBrowse?.slug);
    } finally {
      setLeftLoading(false);
    }
  }

  async function selectRight(artist: BrowseArtist) {
    setRightBrowse(artist);
    if (!artist.slug) return;

    setRightLoading(true);
    try {
      const full = await compareSuggestArtist(artist.slug);
      setRightArtist(full);
      updateUrl(leftBrowse?.slug, artist.slug);
    } finally {
      setRightLoading(false);
    }
  }

  function clearLeft() {
    setLeftBrowse(null);
    setLeftArtist(null);
  }

  function clearRight() {
    setRightBrowse(null);
    setRightArtist(null);
  }

  // ── Share ──────────────────────────────────────────────────

  async function handleShare() {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const bothSelected = leftArtist && rightArtist;

  // ── Suggested comparisons ───────────────────────────────────

  const SUGGESTED = [
    { left: "wizkid", right: "burna-boy", label: "Wizkid vs Burna Boy" },
    { left: "tems", right: "ayra-starr", label: "Tems vs Ayra Starr" },
    { left: "drake", right: "bad-bunny", label: "Drake vs Bad Bunny" },
    { left: "beyonce", right: "rihanna", label: "Beyoncé vs Rihanna" },
  ];

  // ── UI ─────────────────────────────────────────────────────

  return (
    <div className="pb-16 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Compare Artists
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search two artists to compare their stats head to head
          </p>
        </div>

        {bothSelected && (
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </button>
        )}
      </div>

      {/* Search */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <ArtistSearch
          selected={leftBrowse}
          onSelect={selectLeft}
          onClear={clearLeft}
          placeholder="Search first artist..."
        />
        <ArtistSearch
          selected={rightBrowse}
          onSelect={selectRight}
          onClear={clearRight}
          placeholder="Search second artist..."
        />
      </div>

      {/* Loading */}
      {(leftLoading || rightLoading) && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[leftLoading, rightLoading].map((loading, i) =>
            loading ? (
              <div
                key={i}
                className="h-64 rounded-2xl border border-border bg-muted animate-pulse"
              />
            ) : (
              <div key={i} />
            ),
          )}
        </div>
      )}

      {/* Cards */}
      {!leftLoading && !rightLoading && (leftArtist || rightArtist) && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>{leftArtist && <CompareArtistCard artist={leftArtist} />}</div>
          <div>{rightArtist && <CompareArtistCard artist={rightArtist} />}</div>
        </div>
      )}

      {/* Comparison */}
      {bothSelected && !leftLoading && !rightLoading && (
        <div className="flex flex-col gap-6">
          <CompareScoreCard left={leftArtist} right={rightArtist} />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <GitCompare className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Head to Head
              </h2>
            </div>

            <CompareStatRow left={leftArtist} right={rightArtist} />
          </div>
        </div>
      )}

      {/* Empty */}
      {!leftBrowse && !rightBrowse && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GitCompare className="w-10 h-10 text-muted-foreground/20 mb-3" />
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Search two artists above to compare
          </p>
          <p className="text-xs text-muted-foreground/60 mb-8">
            Streams, listeners, charts, awards and more
          </p>

          <div className="flex flex-col gap-2 w-full max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
              Popular comparisons
            </p>

            {SUGGESTED.map((s) => (
              <button
                key={s.label}
                onClick={() => router.push(`/compare/${s.left}-vs-${s.right}`)}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:shadow-sm hover:-translate-y-0.5 transition-all"
              >
                {s.label}
                <span className="text-muted-foreground/40">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
