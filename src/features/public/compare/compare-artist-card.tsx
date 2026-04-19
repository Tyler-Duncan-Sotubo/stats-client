import Image from "next/image";
import Link from "next/link";
import type { PublicArtist } from "@/lib/api/public";
import { getCountryName } from "@/shared/utils/get-country-name";
import { formatNumber } from "@/shared/utils/format";

export function CompareArtistCard({ artist }: { artist: PublicArtist }) {
  const grammyWins = artist.awards.filter(
    (a) => a.awardBody === "Grammy" && a.result === "won",
  ).length;
  const grammyNoms = artist.awards.filter(
    (a) => a.awardBody === "Grammy",
  ).length;

  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <div className="flex flex-col items-center rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative h-48 w-full bg-muted overflow-hidden">
          {artist.imageUrl ? (
            <Image
              src={artist.imageUrl}
              alt={artist.name}
              fill
              sizes="148px"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-6xl font-bold text-muted-foreground/20">
                {artist.name[0]}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-xl font-bold text-white leading-tight">
              {artist.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {artist.originCountry && (
                <span className="text-xs text-white/60">
                  {getCountryName(artist.originCountry)}
                </span>
              )}
              {grammyNoms > 0 && (
                <>
                  <span className="text-white/30">·</span>
                  <span className="text-xs text-amber-400/90 font-medium">
                    {grammyNoms}× Grammy nominated
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-px bg-border w-full">
          {[
            {
              label: "Total Streams",
              value: artist.totalStreams
                ? formatNumber(Number(artist.totalStreams))
                : "—",
            },
            {
              label: "Monthly Listeners",
              value: artist.monthlyListeners
                ? formatNumber(Number(artist.monthlyListeners))
                : "—",
            },
          ].map((s) => (
            <div key={s.label} className="bg-card px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
                {s.label}
              </p>
              <p className="text-lg font-bold tabular-nums text-foreground">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
