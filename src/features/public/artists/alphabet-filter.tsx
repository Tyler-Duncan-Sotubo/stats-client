"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetFilterProps {
  currentLetter?: string;
}

export function AlphabetFilter({ currentLetter }: AlphabetFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setLetter(letter: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (letter) {
      params.set("letter", letter);
    } else {
      params.delete("letter");
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-px rounded-xl p-1 flex-wrap w-full justify-center">
      {ALPHABET.map((l) => (
        <button
          key={l}
          onClick={() => setLetter(l === currentLetter ? undefined : l)}
          className={`rounded-lg px-3 py-1.5 text-lg font-semibold transition-all min-w-7 text-center ${
            currentLetter === l
              ? "bg-primary text-white shadow-sm"
              : "text-black hover:text-foreground hover:bg-background/60"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
