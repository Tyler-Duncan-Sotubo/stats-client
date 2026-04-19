// shared/ui/logo.tsx
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const sizes = {
  xs: { icon: 16, text: "text-[10px]", letter: "text-[8px]" },
  sm: { icon: 20, text: "text-xs", letter: "text-[9px]" },
  md: { icon: 28, text: "text-sm", letter: "text-xs" },
  lg: { icon: 40, text: "text-base", letter: "text-sm" },
};

const LOGO_SRC = "/stats/logo.png"; // ← put your logo here in /public/stats/logo.png

function LogoMark({ size = "md" }: { size?: LogoProps["size"] }) {
  const s = sizes[size ?? "md"];
  const dim = s.icon;

  return (
    <div
      style={{ width: dim, height: dim }}
      className="relative shrink-0 rounded-md overflow-hidden"
    >
      <Image
        src={LOGO_SRC}
        alt="AfroStats"
        fill
        sizes={`${dim}px`}
        className="object-contain"
        onError={(e) => {
          // fallback to letter mark if image fails
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.classList.add(
              "bg-primary",
              "flex",
              "items-center",
              "justify-center",
            );
            parent.innerHTML = `<span class="text-white font-bold ${s.letter}">A</span>`;
          }
        }}
      />
    </div>
  );
}

function LogoText({ size = "md" }: { size?: LogoProps["size"] }) {
  const s = sizes[size ?? "md"];
  return (
    <span
      className={cn("font-semibold text-foreground tracking-tight", s.text)}
    >
      Afro<span className="text-primary">Stats</span>
    </span>
  );
}

function LogoInner({
  size,
  showText,
  className,
}: {
  size: LogoProps["size"];
  showText: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark size={size} />
      {showText && <LogoText size={size} />}
    </div>
  );
}

export function Logo({
  href = "/",
  size = "md",
  showText = true,
  className,
}: LogoProps) {
  if (!href) {
    return <LogoInner size={size} showText={showText} className={className} />;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <LogoMark size={size} />
      {showText && <LogoText size={size} />}
    </Link>
  );
}

// For embeds — uses <a> instead of Next Link
export function LogoAnchor({
  href = "https://tooxclusive.com/stats",
  size = "md",
  showText = true,
  className,
}: LogoProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("flex items-center gap-2", className)}
    >
      <LogoMark size={size} />
      {showText && <LogoText size={size} />}
    </a>
  );
}

export { LogoMark, LogoText };
