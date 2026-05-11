"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export function MilestoneFactsPagination({
  page,
  totalPages,
  total,
  limit,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-xs text-muted-foreground">
        Showing {((page - 1) * limit + 1).toLocaleString()}–
        {Math.min(page * limit, total).toLocaleString()} of{" "}
        {total.toLocaleString()} milestones
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
          className="flex items-center justify-center rounded-lg border border-border h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-3 text-sm text-muted-foreground">
          {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => goToPage(page + 1)}
          className="flex items-center justify-center rounded-lg border border-border h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
