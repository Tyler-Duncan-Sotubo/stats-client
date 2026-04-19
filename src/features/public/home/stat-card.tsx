import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { getTextColors } from "@/shared/utils/get-text-colors";

interface StatCardProps {
  label: string;
  value: string;
  lines?: string[];
  imageUrl?: string | null;
  imageAlt?: string;
  href?: string;
  backgroundColor?: string;
  className?: string;
  badge?: ReactNode;
}

export function StatCard({
  label,
  value,
  lines = [],
  imageUrl,
  imageAlt,
  href,
  backgroundColor = "#1a1a2e",
  className,
  badge,
}: StatCardProps) {
  const colors = getTextColors(backgroundColor);

  const inner = (
    <div
      className={cn(
        "relative h-60 w-full overflow-hidden rounded-2xl border px-5 py-6 transition-all",
        "cursor-pointer hover:scale-[1.01] hover:shadow-xl",
        className,
      )}
      style={{
        backgroundColor,
        borderColor: colors.ring,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.18) 80%, rgba(0,0,0,0.42) 100%)",
        }}
      />

      <div
        className={cn(
          "relative z-10 flex h-full flex-col justify-center",
          imageUrl ? "w-[65%]" : "w-full pr-10",
        )}
      >
        <p
          className="mb-3 text-xs font-bold uppercase leading-none tracking-[0.18em]"
          style={{ color: colors.label }}
        >
          {label}
        </p>

        <p
          className="mb-4 text-2xl font-bold leading-none tabular-nums"
          style={{ color: colors.value }}
        >
          {value}
        </p>

        {badge && <div className="mb-4 text-xs">{badge}</div>}

        <div className="flex flex-col gap-2">
          {lines.map((line, i) => (
            <p
              key={i}
              className="leading-snug"
              style={{
                color: i === 0 ? colors.secondary : colors.muted,
                fontSize: i === 0 ? "1.1rem" : "0.8rem",
                fontWeight: i === 0 ? 600 : 400,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {imageUrl && (
        <div className="absolute right-5 top-1/2 z-10 flex w-[30%] -translate-y-1/2 items-center justify-center">
          <div
            className="h-28 w-28 shrink-0 overflow-hidden rounded-full"
            style={{ boxShadow: `0 0 0 2px ${colors.ring}` }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt ?? label}
              width={112}
              height={112}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      )}

      {!imageUrl && (
        <div
          className="absolute right-5 top-1/2 z-10 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full"
          style={{
            backgroundColor: colors.fallback,
            boxShadow: `0 0 0 1px ${colors.ring}`,
          }}
        >
          <span className="text-2xl font-bold" style={{ color: colors.muted }}>
            {value[0]}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {inner}
      </Link>
    );
  }

  return inner;
}
