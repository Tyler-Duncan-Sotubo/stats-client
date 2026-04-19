import Image from "next/image";
import Link from "next/link";
import type { SongFeature } from "@/lib/api/public";
import { toTitleCase } from "@/shared/utils/format";

export function SongFeatures({ features }: { features: SongFeature[] }) {
  if (!features.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Featured Artists
      </h2>
      <div className="flex flex-col gap-2">
        {features.map((f) => (
          <Link
            key={f.artistId}
            href={f.artistSlug ? `/artists/${f.artistSlug}` : "#"}
            className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:shadow-sm transition-all hover:-translate-y-0.5"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
              {f.artistImageUrl ? (
                <Image
                  src={f.artistImageUrl}
                  alt={f.artistName ?? ""}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm font-bold text-muted-foreground/30">
                    {f.artistName?.[0]}
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground">
              {f.artistName ? toTitleCase(f.artistName) : "—"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
