export default function RankingSlugLoading() {
  return (
    <div className="max-w-2xl pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse shrink-0" />
          <div className="space-y-2">
            <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            <div className="h-6 w-56 bg-muted rounded animate-pulse" />
            <div className="h-3 w-40 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </div>

      {/* Intro box */}
      <div className="rounded-xl border border-border bg-muted/20 px-5 py-4 mb-6 space-y-2">
        <div className="h-3.5 w-28 bg-muted rounded animate-pulse" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
          <div className="h-3 w-3/5 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Song list */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-4 py-3 ${
              i !== 0 ? "border-t border-border" : ""
            }`}
          >
            <div className="w-6 h-3 bg-muted rounded animate-pulse shrink-0" />
            <div className="w-10 h-10 rounded bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-3 w-10 bg-muted rounded animate-pulse" />
            </div>
            <div className="text-right space-y-1">
              <div className="h-3.5 w-16 bg-muted rounded animate-pulse" />
              <div className="h-3 w-10 bg-muted rounded animate-pulse ml-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 rounded-xl border border-border bg-card px-4 py-3 space-y-2">
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
