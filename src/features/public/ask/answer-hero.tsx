import { getTextColors } from "@/shared/utils/get-text-colors";
import { useMemo } from "react";

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

/* ── NEW: answer formatter ───────────────────────── */

function formatHeroAnswer(answer: string): string {
  const lower = answer.toLowerCase();

  // handle leaderboard-style answers
  if (lower.includes("top 10")) {
    const match = answer.match(/1\.\s([^,(]+).*?\(([\d,]+)\)/);

    // if we can extract #1 → show clean insight
    if (match) {
      const name = match[1];
      const streams = match[2];
      return `${name} leads with ${streams} Spotify streams.`;
    }

    // fallback truncate
    const parts = answer.split(",");
    if (parts.length > 3) {
      return parts.slice(0, 3).join(", ") + "…";
    }
  }

  return answer;
}

/* ───────────────────────────────────────────────── */

interface AnswerHeroProps {
  question: string;
  answer: string;
}

export function AnswerHero({ question, answer }: AnswerHeroProps) {
  const bg = useMemo(() => getBgForQuestion(question), [question]);
  const colors = useMemo(() => getTextColors(bg), [bg]);

  const formattedAnswer = useMemo(() => formatHeroAnswer(answer), [answer]);

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

        {/* footer */}
        <p className="text-xs mt-4" style={{ color: colors.muted }}>
          Spotify streams only · Data updated daily
        </p>
      </div>
    </div>
  );
}
