"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import type { BrowseArtist } from "@/lib/api/public";
import { suggestArtists } from "@/lib/api/public"; // ← swap import
import { getCountryName } from "@/shared/utils/get-country-name";

interface ArtistSearchProps {
  onSelect: (artist: BrowseArtist) => void;
  selected: BrowseArtist | null;
  onClear: () => void;
  placeholder?: string;
}

export function ArtistSearch({
  onSelect,
  selected,
  onClear,
  placeholder = "Search artist...",
}: ArtistSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BrowseArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await suggestArtists({
          letter: query[0].toUpperCase(),
          limit: 100,
          sortBy: "totalStreams",
        });
        const filtered = res.data.filter((a) =>
          a.name.toLowerCase().includes(query.toLowerCase()),
        );
        setResults(filtered);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (selected) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
          {selected.imageUrl ? (
            <Image
              src={selected.imageUrl}
              alt={selected.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm font-bold text-muted-foreground/30">
                {selected.name[0]}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {selected.name}
          </p>
          {selected.originCountry && (
            <p className="text-xs text-muted-foreground">
              {getCountryName(selected.originCountry)}
            </p>
          )}
        </div>
        <button
          onClick={onClear}
          className="shrink-0 rounded-full p-1 hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 pl-9 pr-9 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
          {results.map((artist) => (
            <button
              key={artist.id}
              onClick={() => {
                onSelect(artist);
                setQuery("");
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors text-left"
            >
              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
                {artist.imageUrl ? (
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground/30">
                      {artist.name[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {artist.name}
                </p>
                {artist.originCountry && (
                  <p className="text-xs text-muted-foreground">
                    {getCountryName(artist.originCountry)}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-lg z-50 px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">No artists found</p>
        </div>
      )}
    </div>
  );
}
