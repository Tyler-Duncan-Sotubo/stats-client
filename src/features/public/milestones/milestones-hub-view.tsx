import Link from "next/link";
import { formatNumber } from "@/shared/utils/format";
import type { MilestoneCountsResponse } from "@/lib/api/public";

interface TierCardProps {
  href: string;
  count: number;
  label: string;
  sublabel?: string;
}

function TierCard({ href, count, label, sublabel }: TierCardProps) {
  return (
    <Link
      href={href}
      className="relative rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-primary/5 transition-all group overflow-hidden"
    >
      <p className="text-3xl font-bold tabular-nums text-foreground mb-1">
        {formatNumber(count)}
      </p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      {sublabel && (
        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
      )}
      <p className="text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        View all →
      </p>
    </Link>
  );
}

interface SectionProps {
  title: string;
  badge?: string;
  children: React.ReactNode;
}

function Section({ title, badge, children }: SectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          {title}
        </h2>
        {badge && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20">
            {badge}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{children}</div>
    </section>
  );
}

interface Props {
  counts: MilestoneCountsResponse;
}

export function MilestonesHubView({ counts }: Props) {
  return (
    <div className="pb-16 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Spotify Stream Milestones
        </h1>
        <p className="text-sm text-muted-foreground">
          Artists and songs that have crossed major streaming thresholds on
          Spotify.
        </p>
      </div>

      <Section title="Artists — Global">
        <TierCard
          href="/milestones/artists/5-billion-streams"
          count={counts.artists["5-billion-streams"] ?? 0}
          label="5 Billion+ Streams"
          sublabel="All-time giants"
        />
        <TierCard
          href="/milestones/artists/1-billion-streams"
          count={counts.artists["1-billion-streams"] ?? 0}
          label="1 Billion+ Streams"
          sublabel="Global superstars"
        />
        <TierCard
          href="/milestones/artists/500-million-streams"
          count={counts.artists["500-million-streams"] ?? 0}
          label="500 Million+ Streams"
          sublabel="Established names"
        />
      </Section>

      <Section title="Artists — Afrobeats" badge="Africa">
        <TierCard
          href="/milestones/afrobeats/artists/5-billion-streams"
          count={counts.afrobeatsArtists["5-billion-streams"] ?? 0}
          label="5 Billion+ Streams"
          sublabel="Afrobeats royalty"
        />
        <TierCard
          href="/milestones/afrobeats/artists/1-billion-streams"
          count={counts.afrobeatsArtists["1-billion-streams"] ?? 0}
          label="1 Billion+ Streams"
          sublabel="Global Afrobeats stars"
        />
        <TierCard
          href="/milestones/afrobeats/artists/500-million-streams"
          count={counts.afrobeatsArtists["500-million-streams"] ?? 0}
          label="500 Million+ Streams"
          sublabel="Rising forces"
        />
      </Section>

      <Section title="Songs — Global">
        <TierCard
          href="/milestones/songs/1-billion-streams"
          count={counts.songs["1-billion-streams"] ?? 0}
          label="1 Billion+ Streams"
          sublabel="All-time hits"
        />
        <TierCard
          href="/milestones/songs/500-million-streams"
          count={counts.songs["500-million-streams"] ?? 0}
          label="500 Million+ Streams"
          sublabel="Massive records"
        />
        <TierCard
          href="/milestones/songs/100-million-streams"
          count={counts.songs["100-million-streams"] ?? 0}
          label="100 Million+ Streams"
          sublabel="Certified hits"
        />
      </Section>
    </div>
  );
}
