export default function SongLoading() {
  return (
    <div className="pb-16 max-w-5xl">
      {/* Back */}
      <div className="h-3 w-20 rounded bg-muted animate-pulse mb-6" />

      {/* Hero */}
      <div className="flex items-center gap-6 mb-8">
        <div className="h-32 w-32 rounded-2xl bg-muted animate-pulse shrink-0" />
        <div className="flex-1">
          <div className="h-8 w-64 rounded-lg bg-muted animate-pulse mb-2" />
          <div className="h-4 w-40 rounded bg-muted animate-pulse mb-4" />
          <div className="flex gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-24 rounded-full bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card px-4 py-4"
          >
            <div className="h-3 w-20 rounded bg-muted animate-pulse mb-3" />
            <div className="h-7 w-24 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div>
        <div className="h-3 w-24 rounded bg-muted animate-pulse mb-4" />
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-4 border-b border-border last:border-0"
            >
              <div>
                <div className="h-3 w-32 rounded bg-muted animate-pulse mb-1.5" />
                <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
              </div>
              <div className="flex gap-6">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j}>
                    <div className="h-2.5 w-10 rounded bg-muted animate-pulse mb-1.5" />
                    <div className="h-3 w-8 rounded bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
