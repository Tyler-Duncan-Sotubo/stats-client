export default function ArtistLoading() {
  return (
    <div className="pb-16">
      {/* Hero skeleton */}
      <div className="relative h-56 w-full bg-muted animate-pulse" />

      <div className="px-6 mt-8">
        {/* Stat row skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-card px-4 py-4"
            >
              <div className="h-3 w-20 rounded-md bg-muted animate-pulse mb-3" />
              <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Left */}
          <div className="flex flex-col gap-8">
            {/* Top songs */}
            <div>
              <div className="h-3 w-24 rounded-md bg-muted animate-pulse mb-4" />
              <div className="rounded-xl border border-border overflow-hidden bg-card">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0"
                  >
                    <div className="h-3 w-4 rounded bg-muted animate-pulse" />
                    <div className="flex-1">
                      <div className="h-3 w-40 rounded bg-muted animate-pulse mb-1.5" />
                      <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="text-right">
                      <div className="h-3 w-16 rounded bg-muted animate-pulse mb-1.5" />
                      <div className="h-2.5 w-12 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart history */}
            <div>
              <div className="h-3 w-28 rounded-md bg-muted animate-pulse mb-4" />
              <div className="rounded-xl border border-border overflow-hidden bg-card">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-4 border-b border-border last:border-0"
                  >
                    <div>
                      <div className="h-3 w-32 rounded bg-muted animate-pulse mb-1.5" />
                      <div className="h-2.5 w-24 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="flex gap-6">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="text-right">
                          <div className="h-2.5 w-10 rounded bg-muted animate-pulse mb-1.5" />
                          <div className="h-3 w-8 rounded bg-muted animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div>
              <div className="h-3 w-16 rounded-md bg-muted animate-pulse mb-4" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <div className="h-4 w-4 rounded bg-muted animate-pulse mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 w-48 rounded bg-muted animate-pulse mb-1.5" />
                      <div className="h-2.5 w-32 rounded bg-muted animate-pulse" />
                    </div>
                    <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-6">
            {/* Certifications */}
            <div>
              <div className="h-3 w-28 rounded-md bg-muted animate-pulse mb-4" />
              <div className="rounded-xl border border-border bg-card px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="h-3 w-12 rounded bg-muted animate-pulse mb-1.5" />
                    <div className="h-2.5 w-8 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                </div>
              </div>
            </div>

            {/* Records */}
            <div>
              <div className="h-3 w-28 rounded-md bg-muted animate-pulse mb-4" />
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <div className="h-4 w-4 rounded bg-muted animate-pulse mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="h-3 w-full rounded bg-muted animate-pulse mb-1.5" />
                      <div className="h-3 w-3/4 rounded bg-muted animate-pulse mb-1.5" />
                      <div className="h-2.5 w-20 rounded bg-muted animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
