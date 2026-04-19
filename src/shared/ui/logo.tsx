import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: number;
  href?: string;
  offsetY?: string; // e.g. "-my-10"
  className?: string;
};

export default function Logo({
  size = 60,
  href = "/",
  offsetY,
  className,
}: LogoProps) {
  return (
    <Link href={href} className="inline-flex items-start leading-none">
      <Image
        src="/needit-logo.png"
        alt="NeedIt"
        width={size * 3}
        height={size}
        priority
        className={cn(
          "h-auto w-auto object-contain align-top -mb-2",
          offsetY,
          className,
        )}
      />
    </Link>
  );
}
