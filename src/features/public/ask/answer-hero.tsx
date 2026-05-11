import { getTextColors } from "@/shared/utils/get-text-colors";
import { useMemo } from "react";
import { ShareButton } from "@/shared/ui/share-button";

const BG_COLORS = [
  "#0C1A2E",
  "#134E4A",
  "#1C1917",
  "#7C2D12",
  "#1E1B4B",
  "#064E3B",
  "#1A1A2E",
  "#3B0764",
];

function getBgForQuestion(question: string): string {
  let hash = 0;
  for (let i = 0; i < question.length; i++) {
    hash = question.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}

function formatCount(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function formatNumbersInText(text: string): string {
  return text.replace(/\b(\d{1,3}(?:,\d{3})+|\d{4,})\b/g, (match) => {
    const num = parseInt(match.replace(/,/g, ""), 10);
    return formatCount(num);
  });
}

function formatHeroAnswer(answer: string): string {
  const lower = answer.toLowerCase();

  if (lower.includes("top 10")) {
    const match = answer.match(/1\.\s([^,(]+).*?\(([\d,]+)\)/);

    if (match) {
      const name = match[1];
      const rawStreams = parseInt(match[2].replace(/,/g, ""), 10);
      return `${name} leads with ${formatCount(rawStreams)} Spotify streams.`;
    }

    const parts = answer.split(",");
    if (parts.length > 3) {
      return formatNumbersInText(parts.slice(0, 3).join(", ")) + "…";
    }
  }

  return formatNumbersInText(answer);
}

interface AnswerHeroProps {
  question: string;
  answer: string;
  slug: string | undefined;
}

export function AnswerHero({ question, answer, slug }: AnswerHeroProps) {
  const bg = useMemo(() => getBgForQuestion(question), [question]);
  const colors = useMemo(() => getTextColors(bg), [bg]);
  const formattedAnswer = useMemo(() => formatHeroAnswer(answer), [answer]);

  const shareUrl = slug
    ? `https://tooxclusive.com/stats/ask/${slug}`
    : undefined;

  return (
    <div
      className="rounded-2xl px-6 py-8 mb-6 relative overflow-hidden"
      style={{ backgroundColor: bg }}
    >
      {/* subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(${colors.value} 1px, transparent 1px), linear-gradient(90deg, ${colors.value} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10">
        {/* question */}
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: colors.label }}
        >
          {question}
        </p>

        {/* answer */}
        <p
          className="text-3xl font-semibold leading-snug"
          style={{ color: colors.value }}
        >
          {formattedAnswer}
        </p>

        {/* optional hint for long lists */}
        {answer.toLowerCase().includes("top 10") && (
          <p className="text-xs mt-2" style={{ color: colors.muted }}>
            Full ranking shown below
          </p>
        )}

        {/* footer row — data credit + share */}
        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          <p className="text-xs" style={{ color: colors.muted }}>
            Spotify streams only · Data updated daily
          </p>
          <ShareButton
            title={`${question} — TooXclusive Stats`}
            text={`${formattedAnswer} via @tooxclusive 📊`}
            url={shareUrl as string}
          />
        </div>
      </div>
    </div>
  );
}
