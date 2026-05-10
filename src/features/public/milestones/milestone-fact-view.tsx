import Image from "next/image";
import Link from "next/link";
import type { MilestoneFact } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { getCountryName } from "@/shared/utils/get-country-name";

function formatThreshold(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(0)} Billion`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)} Million`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} Thousand`;
  return n.toString();
}

function metricLabel(metric: string): string {
  if (metric === "monthly_listeners") return "monthly listeners on Spotify";
  return "streams on Spotify";
}

function buildSummary(fact: MilestoneFact): string {
  const threshold = formatThreshold(fact.threshold);
  const metric = metricLabel(fact.metric);
  const date = new Date(fact.crossedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const country = fact.originCountry
    ? (getCountryName(fact.originCountry) ?? fact.originCountry)
    : null;
  const current =
    fact.currentSongStreams > 0
      ? fact.currentSongStreams
      : fact.currentArtistStreams;

  if (fact.songId) {
    return [
      `"${fact.songTitle}" by ${fact.artistName} crossed ${threshold} ${metric} on ${date}.`,
      current > 0
        ? `The song currently has ${formatNumber(current)} total streams on Spotify.`
        : null,
      country
        ? `${fact.artistName} is a ${country} artist${fact.isAfrobeats ? " and part of the global Afrobeats movement" : ""}.`
        : null,
      `Track all streaming statistics for "${fact.songTitle}" on TooXclusive Stats.`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    `${fact.artistName} crossed ${threshold} ${metric} on ${date}.`,
    current > 0
      ? `${fact.artistName} currently has ${formatNumber(current)} total streams on Spotify.`
      : null,
    country
      ? `${fact.artistName} is a ${country} artist${fact.isAfrobeats ? " and one of the most streamed Afrobeats acts globally" : ""}.`
      : null,
    fact.artistMilestones?.length > 1
      ? `This is one of ${fact.artistMilestones.length} major streaming milestones ${fact.artistName} has achieved on Spotify.`
      : null,
    `Track all of ${fact.artistName}'s streaming statistics on TooXclusive Stats.`,
  ]
    .filter(Boolean)
    .join(" ");
}

interface Props {
  fact: MilestoneFact;
}

export function MilestoneFactView({ fact }: Props) {
  const threshold = formatThreshold(fact.threshold);
  const metric = metricLabel(fact.metric);
  const isSong = !!fact.songId;
  const image = isSong ? fact.songImageUrl : fact.artistImageUrl;
  const artistUrl = `/artists/${fact.artistSlug}`;
  const songUrl = fact.songSlug ? `/songs/${fact.songSlug}` : null;
  const summary = buildSummary(fact);
  const current = isSong ? fact.currentSongStreams : fact.currentArtistStreams;

  const crossedDate = new Date(fact.crossedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="pb-16 max-w-2xl">
      {/* Back */}
      <div className="mb-8">
        <Link
          href="/milestones"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Milestones
        </Link>
      </div>

      {/* Main fact card */}
      <div className="rounded-2xl border border-border bg-card p-8 text-center flex flex-col items-center gap-6 mb-8">
        {/* Image */}
        <div
          className={`relative w-32 h-32 overflow-hidden bg-muted ring-2 ring-border/50 ${isSong ? "rounded-xl" : "rounded-full"}`}
        >
          {image ? (
            <Image
              src={image}
              alt={isSong ? fact.songTitle! : fact.artistName}
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        {/* Fact statement */}
        <div className="space-y-2">
          {isSong ? (
            <>
              <p className="text-2xl font-bold text-foreground leading-tight">
                "{fact.songTitle}"
              </p>
              <p className="text-base text-muted-foreground">
                by{" "}
                <Link
                  href={artistUrl}
                  className="text-foreground font-semibold hover:underline"
                >
                  {fact.artistName}
                </Link>
              </p>
            </>
          ) : (
            <Link
              href={artistUrl}
              className="text-2xl font-bold text-foreground hover:underline leading-tight block"
            >
              {fact.artistName}
            </Link>
          )}

          <p className="text-5xl font-black text-primary tabular-nums leading-none py-2">
            {threshold}
          </p>
          <p className="text-lg text-muted-foreground">{metric}</p>
          <p className="text-sm text-muted-foreground">{crossedDate}</p>
        </div>

        {/* Current total */}
        {current > 0 && (
          <div className="rounded-xl bg-muted/40 border border-border px-6 py-4 w-full">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
              Current total
            </p>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {formatNumber(current)}
            </p>
            <p className="text-xs text-muted-foreground">{metric}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href={isSong && songUrl ? songUrl : artistUrl}
            className="rounded-full bg-foreground text-background px-5 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            View full stats →
          </Link>
          {fact.spotifyId && !isSong && (
            <a
              href={`https://open.spotify.com/artist/${fact.spotifyId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-5 py-2 text-sm font-semibold text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
            >
              Open in Spotify
            </a>
          )}
          {fact.spotifyTrackId && isSong && (
            <a
              href={`https://open.spotify.com/track/${fact.spotifyTrackId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#1DB954]/30 bg-[#1DB954]/10 px-5 py-2 text-sm font-semibold text-[#1DB954] hover:bg-[#1DB954]/20 transition-colors"
            >
              Open in Spotify
            </a>
          )}
        </div>
      </div>

      {/* SEO summary paragraph — Google featured snippet target */}
      <div className="rounded-xl border border-border bg-card px-6 py-5 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {summary}
        </p>
      </div>

      {/* Artist milestone timeline */}
      {fact.artistMilestones?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4">
            {fact.artistName}'s Stream Milestones
          </h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {fact.artistMilestones.map((m, i) => {
              const isActive = Number(m.threshold) === fact.threshold;
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 border-b border-border last:border-0 ${isActive ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="text-[10px] font-bold text-primary">
                        ●
                      </span>
                    )}
                    <p
                      className={`text-sm font-medium ${isActive ? "text-primary" : "text-foreground"}`}
                    >
                      {formatThreshold(Number(m.threshold))}{" "}
                      {metricLabel(m.metric)}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.crossedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related artists — links to artist page for internal linking */}
      {fact.isAfrobeats && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4">
            More Afrobeats Stats
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Wizkid", slug: "wizkid" },
              { name: "Burna Boy", slug: "burna-boy" },
              { name: "Rema", slug: "rema" },
              { name: "Asake", slug: "asake" },
              { name: "Davido", slug: "davido" },
              { name: "Tems", slug: "tems" },
              { name: "Ayra Starr", slug: "ayra-starr" },
              { name: "CKay", slug: "ckay" },
            ]
              .filter((a) => a.slug !== fact.artistSlug)
              .slice(0, 4)
              .map((artist) => (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}`}
                  className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
                >
                  {artist.name} →
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
