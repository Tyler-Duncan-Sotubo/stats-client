export default function ChartDetailLoading() {
  return (
    <div className="pb-16 max-w-4xl">
      <div className="h-3 w-20 rounded bg-muted animate-pulse mb-6" />
      <div className="mb-6">
        <div className="h-7 w-48 rounded-lg bg-muted animate-pulse mb-2" />
        <div className="h-4 w-40 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
          >
            <div className="h-4 w-6 rounded bg-muted animate-pulse" />
            <div className="h-4 w-4 rounded bg-muted animate-pulse" />
            <div className="h-10 w-10 rounded-lg bg-muted animate-pulse shrink-0" />
            <div className="flex-1">
              <div className="h-3 w-40 rounded bg-muted animate-pulse mb-1.5" />
              <div className="h-2.5 w-24 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-3 w-8 rounded bg-muted animate-pulse" />
            <div className="h-3 w-8 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
