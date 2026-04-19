import type { ArtistCertification } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";

export function ArtistCertifications({
  certifications,
}: {
  certifications: ArtistCertification[];
}) {
  if (!certifications.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Certifications
      </h2>
      <div className="flex flex-col gap-3">
        {certifications.map((cert) => (
          <div
            key={`${cert.territory}-${cert.body}`}
            className="rounded-xl border border-border bg-card px-4 py-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-foreground">{cert.body}</p>
                <p className="text-xs text-muted-foreground">
                  {cert.territory}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatNumber(Number(cert.totalPlatinumUnits))} units
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {Number(cert.platinumCount) > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                  <span className="text-slate-400 text-xs">💿</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {cert.platinumCount}× Platinum
                  </span>
                </div>
              )}
              {Number(cert.goldCount) > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 px-3 py-1">
                  <span className="text-amber-500 text-xs">💿</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {cert.goldCount}× Gold
                  </span>
                </div>
              )}
              {Number(cert.silverCount) > 0 && (
                <div className="flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1">
                  <span className="text-gray-400 text-xs">💿</span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {cert.silverCount}× Silver
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
