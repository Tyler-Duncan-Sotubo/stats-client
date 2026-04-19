import Link from "next/link";
import Image from "next/image";
import type { AvailableChart } from "@/lib/api/public";
import {
  CHART_GROUPS,
  CHART_LABELS,
  CHART_LOGOS,
} from "@/lib/constants/charts";

export function ChartsView({ charts }: { charts: AvailableChart[] }) {
  const chartMap = new Map(
    charts.map((c) => [`${c.chartName}-${c.chartTerritory}`, c]),
  );

  return (
    <div className="pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Charts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {charts.length} charts available
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {Object.entries(CHART_GROUPS).map(([group, chartDefs]) => {
          const groupCharts = chartDefs
            .map(({ name, territory }) => chartMap.get(`${name}-${territory}`))
            .filter(Boolean) as AvailableChart[];

          if (!groupCharts.length) return null;

          return (
            <div key={group}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {group}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {groupCharts.map((chart) => {
                  const logo = CHART_LOGOS[chart.chartName];
                  return (
                    <Link
                      key={`${chart.chartName}-${chart.chartTerritory}`}
                      href={`/charts/${chart.chartName}/${chart.chartTerritory}`}
                      className="group flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 hover:shadow transition-all hover:-translate-y-0.5"
                    >
                      {/* Logo */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg overflow-hidden">
                        {logo ? (
                          <Image
                            src={logo}
                            alt={
                              CHART_LABELS[chart.chartName] ?? chart.chartName
                            }
                            width={60}
                            height={60}
                            className="object-contain"
                          />
                        ) : (
                          <span className="text-xs font-bold text-muted-foreground">
                            {chart.chartTerritory}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {CHART_LABELS[chart.chartName] ?? chart.chartName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {chart.totalEntries} entries · Updated{" "}
                          {new Date(chart.latestWeek).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <span className="text-muted-foreground/40 group-hover:text-primary transition-colors text-lg">
                        →
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
