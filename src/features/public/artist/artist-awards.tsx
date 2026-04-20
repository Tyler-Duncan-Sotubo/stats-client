import type { ArtistAward } from "@/lib/api/public";
import { Trophy, Star } from "lucide-react";

export function ArtistAwards({ awards }: { awards: ArtistAward[] }) {
  if (!awards.length) return null;

  const sorted = [...awards].sort((a, b) => {
    // wins first, then by year desc
    if (a.result === "won" && b.result !== "won") return -1;
    if (a.result !== "won" && b.result === "won") return 1;
    return b.year - a.year;
  });

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Awards
      </h2>
      <div className="flex flex-col gap-2">
        {sorted.map((award) => (
          <div
            key={award.id}
            className="flex  items-start gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <div
              className={`mt-0.5 shrink-0 ${
                award.result === "won"
                  ? "text-amber-500"
                  : "text-muted-foreground/40"
              }`}
            >
              {award.result === "won" ? (
                <Trophy className="w-4 h-4" />
              ) : (
                <Star className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {award.awardName}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {award.awardBody} · {award.ceremony ?? award.year}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                award.result === "won"
                  ? "bg-amber-500/10 text-amber-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {award.result === "won" ? "Won" : "Nominated"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
