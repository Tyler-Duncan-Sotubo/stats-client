import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  baseHref: string;
}

export function MilestonePagination({ page, totalPages, baseHref }: Props) {
  if (totalPages <= 1) return null;

  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return start + i;
  });

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {prev ? (
        <Link
          href={`${baseHref}?page=${prev}`}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-xs hover:bg-muted/40 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground/40 cursor-not-allowed">
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </span>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={`${baseHref}?page=${p}`}
          className={`w-9 h-9 flex items-center justify-center rounded-lg border text-xs font-medium transition-colors ${
            p === page
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:bg-muted/40"
          }`}
        >
          {p}
        </Link>
      ))}

      {next ? (
        <Link
          href={`${baseHref}?page=${next}`}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-xs hover:bg-muted/40 transition-colors"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground/40 cursor-not-allowed">
          Next <ChevronRight className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
  );
}
