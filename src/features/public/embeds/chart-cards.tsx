export function ChartCard({
  platform,
  song,
  artist,
  meta,
  badge,
  imageUrl,
  href,
  bg,
  accent,
}: {
  platform: string;
  song: string;
  artist: string;
  meta: string;
  badge?: string | null;
  imageUrl?: string | null;
  href: string;
  bg: string;
  accent: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ background: bg }}
      className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 p-5 transition-transform hover:scale-[1.01]"
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-black/30" />

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={artist}
          className="relative z-10 h-24 w-24 shrink-0 rounded-full object-cover ring-2 ring-white/20"
        />
      ) : (
        <div className="relative z-10 flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-2xl font-bold text-white">
          1
        </div>
      )}

      <div className="relative z-10 min-w-0 flex-1">
        <p
          className="mb-1.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accent, opacity: 0.8 }}
        >
          {platform} #1
        </p>
        <p className="truncate text-lg font-bold leading-tight text-white">
          {song}
        </p>
        <p className="truncate text-sm font-medium text-white/75">{artist}</p>
        <p className="mt-1 text-[11px] text-white/50">{meta}</p>
        {badge && (
          <span className="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/80">
            {badge}
          </span>
        )}
      </div>
    </a>
  );
}
