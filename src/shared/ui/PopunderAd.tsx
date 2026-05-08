"use client";

import { useEffect } from "react";

const ZONE = "5514758";
const SRC = "https://al5sm.com/tag.min.js";
const STORAGE_KEY = "ac_popunder_last_shown";

function hasShownToday(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const { date } = JSON.parse(raw);
    return date === new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  } catch {
    return false;
  }
}

function markShownToday(): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: new Date().toISOString().slice(0, 10) }),
    );
  } catch {}
}

function loadScript(): void {
  const s = document.createElement("script");
  s.dataset.zone = ZONE;
  s.src = SRC;
  s.async = true;
  (document.body || document.documentElement).appendChild(s);
}

export function PopunderAd() {
  useEffect(() => {
    // Skip in iframes (same check you use for GA)
    if (window.self !== window.top) return;

    if (hasShownToday()) return;

    function handleClick() {
      if (hasShownToday()) return;
      markShownToday();
      loadScript();
      document.removeEventListener("click", handleClick);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
