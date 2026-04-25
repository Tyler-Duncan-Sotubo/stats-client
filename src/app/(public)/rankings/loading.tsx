// app/rankings/loading.tsx
export default function RankingsLoading() {
  return (
    <div className="pb-16">
      {/* Hero skeleton */}
      <div className="mb-10">
        <div className="h-3 w-16 bg-muted rounded animate-pulse mb-2" />
        <div className="h-8 w-64 bg-muted rounded animate-pulse mb-3" />
        <div className="h-4 w-96 bg-muted rounded animate-pulse" />
      </div>

      {/* Section label */}
      <div className="h-3 w-40 bg-muted rounded animate-pulse mb-4" />

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
            {/* Links */}
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 last:border-0"
              >
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-3 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Second section */}
      <div className="h-3 w-32 bg-muted rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-24 bg-muted rounded animate-pulse" />
                <div className="h-3 w-32 bg-muted rounded animate-pulse" />
              </div>
            </div>
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 last:border-0"
              >
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-3 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
