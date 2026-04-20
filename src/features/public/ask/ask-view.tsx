import Link from "next/link";
import Image from "next/image";
import type { AskResult, AskQuestion } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { AnswerHero } from "./answer-hero";
import { QuestionGroup } from "./question-group";
import { GriotBanner } from "../layout/griot-banner";
import { ChartList } from "./chart-list";
import { ArtistRankedList } from "./artist-ranked-list";
import { SongRankedList } from "./song-ranked-list";

interface AskViewProps {
  question: string;
  result: AskResult;
  popular: AskQuestion[];
  recent: AskQuestion[];
}

export function AskView({ question, result, popular, recent }: AskViewProps) {
  const isArtist = result.toolUsed === "get_artist";
  const isSongLeaderboard =
    result.toolUsed === "get_leaderboard_songs" ||
    result.toolUsed === "get_artist_top_songs";
  const isArtistLeaderboard =
    result.toolUsed?.startsWith("get_leaderboard") &&
    result.toolUsed !== "get_leaderboard_songs";
  const isTrending = result.toolUsed?.startsWith("get_trending");
  const isChart = result.toolUsed === "get_chart";

  const filteredPopular = popular.filter((q) => q.question !== question);
  const filteredRecent = recent
    .filter((q) => q.question !== question)
    .filter((q) => !filteredPopular.find((p) => p.id === q.id));

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6">
      <div className="pb-10">
        <AnswerHero question={question} answer={result.answer} />

        {isArtist && result.data && (
          <ArtistAnswerCard data={result.data} slug={result.slug} />
        )}

        {isSongLeaderboard && result.data?.data && (
          <SongRankedList items={result.data.data} />
        )}

        {(isArtistLeaderboard || isTrending) && result.data?.data && (
          <ArtistRankedList
            items={result.data.data}
            toolUsed={result.toolUsed ?? ""}
          />
        )}

        {isChart && result.data?.data && <ChartList data={result.data} />}

        <RelatedQuestions popular={filteredPopular} recent={filteredRecent} />

        <div className="space-y-10 mt-10">
          {filteredPopular.length > 0 && (
            <QuestionGroup title="Popular questions" items={filteredPopular} />
          )}
          {filteredRecent.length > 0 && (
            <QuestionGroup title="Recently asked" items={filteredRecent} />
          )}
        </div>
      </div>

      <aside className="hidden xl:block space-y-6 pb-10">
        <GriotBanner />
      </aside>
    </section>
  );
}

function RelatedQuestions({
  popular,
  recent,
}: {
  popular: AskQuestion[];
  recent: AskQuestion[];
}) {
  if (!popular.length && !recent.length) return null;

  return (
    <div className="mt-8 space-y-6 xl:hidden">
      {popular.length > 0 && (
        <QuestionGroup title="Popular questions" items={popular} />
      )}
      {recent.length > 0 && (
        <QuestionGroup title="Recently asked" items={recent} />
      )}
    </div>
  );
}

function ArtistAnswerCard({ data, slug }: { data: any; slug: string | null }) {
  const totalStreams =
    Number(data.totalStreamsAsLead ?? 0) +
    Number(data.totalStreamsAsFeature ?? 0);
  const leadPct =
    totalStreams > 0
      ? Math.round((Number(data.totalStreamsAsLead ?? 0) / totalStreams) * 100)
      : 0;
  const featurePct = 100 - leadPct;

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card mb-6">
      <div className="flex items-center gap-4 p-4 border-b border-border">
        {data.imageUrl && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-muted">
            <Image
              src={data.imageUrl}
              alt={data.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        )}
        <div>
          <p className="text-base font-semibold text-foreground">{data.name}</p>
          {data.originCountry && (
            <p className="text-sm text-muted-foreground">
              {data.originCountry}
            </p>
          )}
        </div>
        {slug && (
          <Link
            href={`/artists/${slug}`}
            className="ml-auto text-sm font-medium text-primary hover:underline shrink-0"
          >
            View full profile →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-border">
        {[
          {
            label: "Total Streams",
            value: data.totalStreams
              ? formatNumber(Number(data.totalStreams))
              : "—",
          },
          {
            label: "Monthly Listeners",
            value: data.monthlyListeners
              ? formatNumber(Number(data.monthlyListeners))
              : "—",
          },
          {
            label: "Daily Streams",
            value: data.dailyStreams
              ? formatNumber(Number(data.dailyStreams))
              : "—",
          },
        ].map((s) => (
          <div key={s.label} className="px-4 py-3">
            <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">
              {s.label}
            </p>
            <p className="text-xl font-bold tabular-nums text-foreground">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {data.totalStreamsAsLead && data.totalStreamsAsFeature && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Stream breakdown
          </p>
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <p className="text-xs text-muted-foreground/50">As lead</p>
              <p className="text-base font-bold tabular-nums text-foreground">
                {formatNumber(Number(data.totalStreamsAsLead))}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground/50">As feature</p>
              <p className="text-base font-bold tabular-nums text-foreground">
                {formatNumber(Number(data.totalStreamsAsFeature))}
              </p>
            </div>
          </div>
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="bg-primary transition-all"
              style={{ width: `${leadPct}%` }}
            />
            <div
              className="bg-rose-500 transition-all"
              style={{ width: `${featurePct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <p className="text-base text-primary">{leadPct}% lead</p>
            <p className="text-base text-rose-500">{featurePct}% feature</p>
          </div>
        </div>
      )}

      {data.topSongs?.length > 0 && (
        <div className="border-t border-border">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 px-4 pt-3 pb-1">
            Top songs
          </p>
          {data.topSongs.slice(0, 3).map((song: any, i: number) => (
            <div
              key={song.id}
              className={`flex items-center justify-between px-4 py-2.5 ${
                i !== 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground/40 w-4 tabular-nums">
                  {i + 1}
                </span>
                {song.slug ? (
                  <Link
                    href={`/songs/${song.slug}`}
                    className="text-base text-foreground hover:text-primary transition-colors"
                  >
                    {song.title}
                  </Link>
                ) : (
                  <p className="text-base text-foreground">{song.title}</p>
                )}
              </div>
              <p className="text-sm tabular-nums text-muted-foreground">
                {song.totalStreams
                  ? formatNumber(Number(song.totalStreams))
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.charts?.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Chart history
          </p>
          <div className="grid grid-cols-2 gap-2">
            {data.charts.slice(0, 4).map((c: any) => (
              <div
                key={`${c.chartName}-${c.role}`}
                className="bg-muted/30 rounded-lg px-3 py-2"
              >
                <p className="text-xs text-muted-foreground/50 truncate capitalize">
                  {c.chartName.replace(/_/g, " ")}
                </p>
                <p className="text-base font-semibold text-foreground">
                  Peak #{c.bestPeakPosition ?? "—"}
                </p>
                <p className="text-xs text-muted-foreground/50">
                  {c.totalChartWeeks}wks
                  {Number(c.weeksAtNumber1) > 0
                    ? ` · ${c.weeksAtNumber1} at #1`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.awards?.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Awards
          </p>
          <div className="flex flex-wrap gap-2">
            {data.awards.slice(0, 6).map((a: any) => (
              <span
                key={a.id}
                className={`text-xs px-2.5 py-1 rounded-full border ${
                  a.result === "won"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-border bg-muted/40 text-muted-foreground"
                }`}
              >
                {a.result === "won" ? "🏆 " : ""}
                {a.awardBody} {a.year}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.records?.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Records
          </p>
          <div className="space-y-2">
            {data.records.slice(0, 3).map((r: any) => (
              <div key={r.id} className="flex items-start gap-2">
                <span className="text-amber-500 text-sm mt-0.5 shrink-0">
                  ◆
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {r.recordType}
                  {r.recordValue && (
                    <span className="text-foreground font-medium">
                      {" "}
                      — {r.recordValue}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.certifications?.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Certifications
          </p>
          <div className="flex flex-wrap gap-2">
            {data.certifications.map((c: any) => (
              <div
                key={c.territory}
                className="bg-muted/40 rounded-lg px-3 py-1.5"
              >
                <p className="text-xs text-muted-foreground/50">
                  {c.body} {c.territory}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatNumber(Number(c.totalPlatinumUnits))} units
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
