import type { ArtistRecord } from "@/lib/api/public";

export function ArtistRecords({ records }: { records: ArtistRecord[] }) {
  if (!records.length) return null;

  const active = records.filter((r) => r.isActive);

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Records & Firsts
      </h2>
      <div className="flex flex-col gap-2">
        {active.map((record) => (
          <div
            key={record.id}
            className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3"
          >
            <span className="mt-0.5 text-base shrink-0">🏆</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground leading-snug">
                {record.recordValue}
              </p>
              {record.setOn && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(record.setOn).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
