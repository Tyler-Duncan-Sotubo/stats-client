import Link from "next/link";

const FOOTER_LINKS = [
  { label: "TooXclusive", href: "https://tooxclusive.com" },
  { label: "Developers", href: "https://developers.tooxclusive.com" },
  {
    label: "Get API Key",
    href: "https://developers.tooxclusive.com/get-api-key",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-6 px-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p className="text-sm transition-colors font-semibold">
          © {new Date().getFullYear()} TooXclusive Stats
        </p>
        <div className="flex items-center gap-6">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors font-semibold hover:underline hover:text-primary"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
