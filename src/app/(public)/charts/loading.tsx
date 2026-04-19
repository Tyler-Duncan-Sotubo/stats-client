export default function ChartsLoading() {
  return (
    <div className="pb-16">
      <div className="mb-8">
        <div className="h-7 w-24 rounded-lg bg-muted animate-pulse mb-2" />
        <div className="h-4 w-32 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="flex flex-col gap-10">
        {Array.from({ length: 2 }).map((_, g) => (
          <div key={g}>
            <div className="h-3 w-28 rounded bg-muted animate-pulse mb-4" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted animate-pulse shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 w-32 rounded bg-muted animate-pulse mb-2" />
                    <div className="h-2.5 w-24 rounded bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
