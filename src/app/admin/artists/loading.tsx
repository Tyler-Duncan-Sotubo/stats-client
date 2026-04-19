export default function ArtistsLoading() {
  return (
    <div className="px-6 pb-16">
      {/* Header */}
      <div className="mb-6">
        <div className="h-7 w-24 rounded-lg bg-muted animate-pulse mb-2" />
        <div className="h-4 w-32 rounded-lg bg-muted animate-pulse" />
      </div>

      {/* Alphabet */}
      <div className="flex gap-1 flex-wrap mb-3">
        {Array.from({ length: 27 }).map((_, i) => (
          <div key={i} className="h-7 w-8 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="h-8 w-64 rounded-xl bg-muted animate-pulse" />
        <div className="h-8 w-36 rounded-xl bg-muted animate-pulse" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-2xl border border-border bg-card p-5"
          >
            <div className="h-28 w-28 rounded-full bg-muted animate-pulse mb-4" />
            <div className="h-3 w-20 rounded bg-muted animate-pulse mb-1.5" />
            <div className="h-2.5 w-14 rounded bg-muted animate-pulse mb-2" />
            <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
