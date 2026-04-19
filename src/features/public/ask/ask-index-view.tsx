import { Search } from "lucide-react";
import type { AskQuestion } from "@/lib/api/public";
import { QuestionGroup } from "./question-group";
import { AskBar } from "@/features/public/layout/ask-bar";

const SUGGESTED = [
  "Who has the most Spotify streams overall?",
  "Who is the most streamed Nigerian artist?",
  "What is number 1 on the UK Afrobeats chart?",
  "Who has the most monthly listeners right now?",
  "What are the top 10 most streamed songs?",
  "Who is growing the fastest right now?",
  "What songs are on the Nigerian Spotify chart?",
  "Who is the most streamed South African artist?",
];

interface AskIndexViewProps {
  popular: AskQuestion[];
  recent: AskQuestion[];
}

export function AskIndexView({ popular, recent }: AskIndexViewProps) {
  const filteredRecent = recent.filter(
    (r) => !popular.find((p) => p.id === r.id),
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-3xl font-semibold text-foreground mb-2">
          tooXclusive Stats
        </h1>
        <p className="text-muted-foreground text-base">
          Ask anything about Afrobeats and African music statistics.
          <br />
          Powered by live Spotify data updated daily.
        </p>
      </div>

      {/* Prominent ask bar */}
      <div className="mb-12 flex justify-center">
        <AskBar className="w-full" />
      </div>

      <div className="space-y-8">
        <QuestionGroup
          title="Try asking"
          items={SUGGESTED.map((q, i) => ({
            id: String(i),
            question: q,
            slug: q
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .replace(/^-|-$/g, ""),
            toolUsed: null,
            answer: null,
            askCount: 0,
            lastAsked: null,
            createdAt: null,
          }))}
          showCount={false}
        />

        {popular.length > 0 && (
          <QuestionGroup title="Popular questions" items={popular} showCount />
        )}

        {filteredRecent.length > 0 && (
          <QuestionGroup
            title="Recently asked"
            items={filteredRecent}
            showCount
          />
        )}
      </div>
    </div>
  );
}
