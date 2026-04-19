"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { suggestQuestions, type AskQuestion } from "@/lib/api/public";

interface AskBarProps {
  defaultValue?: string;
  className?: string;
}

function toSlug(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function AskBar({ defaultValue = "", className = "" }: AskBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AskQuestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSelectingRef = useRef(false); // ← tracks if user is clicking a suggestion

  // sync when defaultValue changes between page navigations
  useEffect(() => {
    setQuery(defaultValue);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  }, [defaultValue]);

  // clear when user navigates away from /ask
  useEffect(() => {
    if (!pathname.startsWith("/ask")) {
      setQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  }, [pathname]);

  // debounced suggest fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = query.trim();

    if (q.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await suggestQuestions(q, 5);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setActiveSuggestion(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  function navigate(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    setSuggestions([]);
    router.push(`/ask/${toSlug(trimmed)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(q);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showSuggestions || suggestions.length === 0) return;
      setActiveSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!showSuggestions || suggestions.length === 0) return;
      setActiveSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        const selected = suggestions[activeSuggestion];
        setQuery(selected.question);
        navigate(selected.question);
      } else {
        navigate(query);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  }

  function handleSuggestionMouseDown(s: AskQuestion) {
    // mousedown fires before blur — set flag so blur doesn't close dropdown
    isSelectingRef.current = true;
    setQuery(s.question);
    navigate(s.question);
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className || "flex-1 max-w-2xl"}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              // don't close if user is clicking a suggestion
              if (isSelectingRef.current) {
                isSelectingRef.current = false;
                return;
              }
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Ask anything about Afrobeats..."
            className="pl-9 pr-8 bg-white focus-visible:ring-1 h-10 text-base placeholder:text-xs lg:placeholder:text-base"
            autoComplete="off"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground animate-spin" />
          )}
          {!loading && query && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // prevent blur
                setQuery("");
                setSuggestions([]);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-border bg-background shadow-md overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onMouseDown={() => handleSuggestionMouseDown(s)}
              onTouchEnd={() => {
                // handle mobile tap
                setQuery(s.question);
                navigate(s.question);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                i === activeSuggestion ? "bg-muted" : "hover:bg-muted/50"
              } ${i !== 0 ? "border-t border-border" : ""}`}
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
              <span className="text-sm text-foreground truncate">
                {s.question}
              </span>
              {s.askCount > 1 && (
                <span className="ml-auto text-xs text-muted-foreground/40 shrink-0">
                  {s.askCount}×
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
