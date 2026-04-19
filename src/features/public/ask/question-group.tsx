import Link from "next/link";
import { Search } from "lucide-react";
import type { AskQuestion } from "@/lib/api/public";

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
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-3">
        {title}
      </p>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {items.map((q, i) => (
          <Link
            key={q.id}
            href={`/ask/${q.slug}`}
            className={`group flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors ${
              i !== 0 ? "border-t border-border" : ""
            }`}
          >
            <Search className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0 group-hover:text-primary transition-colors" />
            <p className="text-sm text-foreground group-hover:text-primary transition-colors truncate flex-1">
              {q.question}
            </p>
            {showCount && q.askCount > 1 && (
              <span className="text-xs text-muted-foreground/30 shrink-0">
                {q.askCount}×
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
