// features/public/artists/artist-sparkline.tsx
"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { ArtistHistoryPoint } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";

const PRIMARY = "#c0402a";
const PRIMARY_MUTED = "#e8876e";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        fontSize: 12,
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 8,
        padding: "8px 12px",
        lineHeight: 1.8,
      }}
    >
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
}

export function ArtistSparkline({
  history,
}: {
  history: ArtistHistoryPoint[];
}) {
  const data = useMemo(
    () =>
      history.map((h) => ({
        date: new Date(h.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
        streams: Number(h.totalStreams ?? 0),
        daily: Number(h.dailyStreams ?? 0),
      })),
    [history],
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Stream History (90 days)
        </p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: PRIMARY }}
            />
            Total
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: PRIMARY_MUTED }}
            />
            Daily
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="artistTotalGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.25} />
              <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
            </linearGradient>
            <linearGradient
              id="artistDailyGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={PRIMARY_MUTED} stopOpacity={0.2} />
              <stop offset="95%" stopColor={PRIMARY_MUTED} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
            opacity={0.5}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="streams"
            name="Total streams"
            stroke={PRIMARY}
            strokeWidth={2}
            fill="url(#artistTotalGradient)"
            dot={false}
            activeDot={{ r: 4, fill: PRIMARY }}
          />
          <Area
            type="monotone"
            dataKey="daily"
            name="Daily streams"
            stroke={PRIMARY_MUTED}
            strokeWidth={1.5}
            fill="url(#artistDailyGradient)"
            dot={false}
            activeDot={{ r: 3, fill: PRIMARY_MUTED }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
