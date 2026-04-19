import Link from "next/link";
import { Users, ArrowLeft } from "lucide-react";

export default function ArtistNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <Users className="w-8 h-8 text-muted-foreground/40" />
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Artist not found
      </h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        We couldn't find this artist. They may not be in our database yet or the
        link may be incorrect.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/artists"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Browse Artists
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Home
        </Link>
      </div>
    </div>
  );
}
