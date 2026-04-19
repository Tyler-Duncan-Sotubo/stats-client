export default function LeaderboardLoading() {
  return (
    <div className="pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-48 rounded-lg bg-muted animate-pulse mb-2" />
        <div className="h-4 w-64 rounded bg-muted animate-pulse" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            <div className="h-32 bg-muted animate-pulse" />
            <div className="p-4">
              <div className="h-4 w-24 rounded bg-muted animate-pulse mb-2" />
              <div className="h-6 w-20 rounded bg-muted animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0"
          >
            <div className="h-4 w-6 rounded bg-muted animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1">
              <div className="h-3 w-32 rounded bg-muted animate-pulse mb-1.5" />
              <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
            <div className="h-4 w-16 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
