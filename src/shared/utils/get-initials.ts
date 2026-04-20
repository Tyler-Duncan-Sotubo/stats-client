export function getInitials(text?: string) {
  if (!text) return "?";
  return text
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}
