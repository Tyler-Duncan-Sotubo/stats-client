"use client";

import { useEffect } from "react";

export function GriotBanner() {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {},
      );
    } catch {}
  }, []);

  return (
    <aside className="hidden xl:block w-75 2xl:w-87.5 shrink-0">
      <div className="sticky top-6 flex items-start">
        <div className="rounded-xl overflow-hidden w-full flex justify-center">
          <ins
            className="adsbygoogle"
            style={{
              display: "inline-block",
              width: "336px",
              height: "280px",
              position: "relative", // ← add this
            }}
            data-ad-client="ca-pub-1115876871453816"
            data-ad-slot="4712180324"
          />
        </div>
      </div>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1115876871453816"
        crossOrigin="anonymous"
      />
    </aside>
  );
}
