"use client";

import Link from "next/link";
import { useNeedsReview } from "../hooks/use-needs-review";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { ArrowRight } from "lucide-react";

export function NeedsReviewList() {
  const { artists, loading, error } = useNeedsReview();

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!artists.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No artists need review right now.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {artists.map((artist) => (
        <Link
          key={artist.id}
          href={`/admin/artists/${artist.id}`}
          className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{artist.name}</p>
              <p className="text-xs text-muted-foreground">
                {artist.originCountry ?? "Unknown country"} ·{" "}
                {artist.entityStatus}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="text-xs">
              Review
            </Badge>
            <ArrowRight
              size={14}
              className="text-muted-foreground group-hover:text-foreground transition-colors"
            />
          </div>
        </Link>
      ))}

      <Link
        href="/admin/artists?needsReview=true"
        className="flex items-center gap-1 text-xs text-primary hover:underline pt-2 px-3"
      >
        View all <ArrowRight size={12} />
      </Link>
    </div>
  );
}
