"use client";

import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import type { AskQuestion } from "@/lib/api/public";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QuestionGroupProps {
  title: string;
  items: AskQuestion[];
  showCount?: boolean;
}

export function QuestionGroup({
  title,
  items,
  showCount = true,
}: QuestionGroupProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  useEffect(() => {
    setLoadingSlug(null);
  }, [pathname]);

  function handleNavigate(slug: string) {
    setLoadingSlug(slug);
    router.push(`/ask/${slug}`);
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-3">
        {title}
      </p>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {items.map((q, i) => {
          const isLoading = loadingSlug === q.slug;

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => handleNavigate(q.slug)}
              disabled={!!loadingSlug}
              className={`w-full group flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors ${
                i !== 0 ? "border-t border-border" : ""
              } ${isLoading ? "bg-muted/40" : ""}`}
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 text-primary shrink-0 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 group-hover:text-primary transition-colors" />
              )}

              <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate flex-1">
                {q.question}
              </p>

              {showCount && q.askCount > 1 && !isLoading && (
                <span className="text-xs text-muted-foreground/30 shrink-0">
                  {q.askCount}×
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
