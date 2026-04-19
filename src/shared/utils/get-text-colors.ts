export function getTextColors(hex: string) {
  // parse hsl or hex — default to dark bg if unrecognised
  let r = 0,
    g = 0,
    b = 0;

  if (hex.startsWith("#")) {
    const h = hex.slice(1);
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
  }

  // relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const isDark = luminance < 0.6;

  return {
    label: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)",
    value: isDark ? "#ffffff" : "#0a0a0a",
    secondary: isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.65)",
    muted: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.40)",
    ring: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.10)",
    fallback: isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)",
  };
}
