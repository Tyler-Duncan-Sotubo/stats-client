import Link from "next/link";
import Image from "next/image";
import type { AskResult, AskQuestion } from "@/lib/api/public";
import { formatNumber } from "@/shared/utils/format";
import { AnswerHero } from "./answer-hero";
import { QuestionGroup } from "./question-group";
import { ChartList } from "./chart-list";
import { ArtistRankedList } from "./artist-ranked-list";
import { SongRankedList } from "./song-ranked-list";

interface AskViewProps {
  question: string;
  result: AskResult;
  popular: AskQuestion[];
  recent: AskQuestion[];
}

const ARTIST_CATEGORIES = [
  "artist_streams",
  "artist_monthly_listeners",
  "artist_daily_streams",
  "artist_peak_listeners",
  "artist_grammy_wins",
  "artist_grammy_nominations",
  "artist_awards",
  "artist_chart_history",
  "artist_milestone",
  "artist_profile",
  "artist_biggest_song",
  "artist_global_rank",
];

const SONG_LEADERBOARD_CATEGORIES = ["leaderboard_songs", "artist_top_songs"];

const ARTIST_LEADERBOARD_CATEGORIES = [
  "leaderboard_streams",
  "leaderboard_listeners",
];

const TRENDING_CATEGORIES = [
  "leaderboard_trending_artists",
  "leaderboard_trending_songs",
];

const CHART_CATEGORIES = ["chart_number_1", "chart_top_5", "chart_list"];

export function AskView({ question, result, popular, recent }: AskViewProps) {
  const toolUsed = result.toolUsed ?? "";

  const isArtist = ARTIST_CATEGORIES.includes(toolUsed);
  const isComparison = toolUsed === "comparison";
  const isSongLeaderboard = SONG_LEADERBOARD_CATEGORIES.includes(toolUsed);
  const isArtistLeaderboard = ARTIST_LEADERBOARD_CATEGORIES.includes(toolUsed);
  const isTrending = TRENDING_CATEGORIES.includes(toolUsed);
  const isChart = CHART_CATEGORIES.includes(toolUsed);

  const filteredPopular = popular.filter((q) => q.question !== question);
  const filteredRecent = recent
    .filter((q) => q.question !== question)
    .filter((q) => !filteredPopular.find((p) => p.id === q.id));

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-6">
      <div className="pb-10">
        <AnswerHero
          question={question}
          answer={result.answer}
          slug={result.slug as string | undefined}
        />

        {isArtist && result.data && (
          <ArtistAnswerCard
            data={result.data}
            slug={result.slug as string | null}
          />
        )}

        {isComparison && result.data && <ComparisonCard data={result.data} />}

        {isSongLeaderboard && result.data?.data && (
          <SongRankedList items={result.data.data} />
        )}

        {(isArtistLeaderboard || isTrending) && result.data?.data && (
          <ArtistRankedList items={result.data.data} toolUsed={toolUsed} />
        )}

        {isChart && result.data?.data && <ChartList data={result.data} />}

        <div className="space-y-10 mt-10">
          {filteredPopular.length > 0 && (
            <QuestionGroup title="Popular questions" items={filteredPopular} />
          )}
          {filteredRecent.length > 0 && (
            <QuestionGroup title="Recently asked" items={filteredRecent} />
          )}
        </div>
      </div>

      <aside className="hidden xl:block space-y-6 pb-10"></aside>
    </section>
  );
}

// ── Artist Answer Card ────────────────────────────────────────────────────────

function ArtistAnswerCard({ data, slug }: { data: any; slug: string | null }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card mb-6">
      {/* Header */}
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

      {/* Stat row */}
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

      {/* Stream breakdown */}
      {data.totalStreamsAsLead && data.totalStreamsAsFeature && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Stream breakdown
          </p>
          {(() => {
            const total =
              Number(data.totalStreamsAsLead) +
              Number(data.totalStreamsAsFeature);
            const leadPct =
              total > 0
                ? Math.round((Number(data.totalStreamsAsLead) / total) * 100)
                : 0;
            const featurePct = 100 - leadPct;
            return (
              <>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <p className="text-xs text-muted-foreground/50">As lead</p>
                    <p className="text-base font-bold tabular-nums text-foreground">
                      {formatNumber(Number(data.totalStreamsAsLead))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground/50">
                      As feature
                    </p>
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
                  <p className="text-base text-rose-500">
                    {featurePct}% feature
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Top songs */}
      {data.topSongs?.length > 0 && (
        <div className="border-t border-border">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 px-4 pt-3 pb-1">
            Top songs
          </p>
          {data.topSongs.slice(0, 3).map((song: any, i: number) => (
            <div
              key={i}
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
                {song.streams
                  ? formatNumber(Number(song.streams))
                  : song.totalStreams
                    ? formatNumber(Number(song.totalStreams))
                    : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Chart history */}
      {data.charts?.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground/50 mb-2">
            Chart history
          </p>
          <div className="grid grid-cols-2 gap-2">
            {data.charts.slice(0, 4).map((c: any) => (
              <div
                key={`${c.chartName}-${c.chartTerritory}`}
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

      {/* Awards */}
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

      {/* Records */}
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
    </div>
  );
}

// ── Comparison Card ───────────────────────────────────────────────────────────

function ComparisonCard({ data }: { data: any }) {
  const { artist1, artist2 } = data;
  if (!artist1 || !artist2) return null;

  const streams1 = Number(artist1.totalStreams ?? 0);
  const streams2 = Number(artist2.totalStreams ?? 0);
  const listeners1 = Number(artist1.monthlyListeners ?? 0);
  const listeners2 = Number(artist2.monthlyListeners ?? 0);

  const streamWinner = streams1 >= streams2 ? 1 : 2;
  const listenerWinner = listeners1 >= listeners2 ? 1 : 2;

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card mb-6">
      <div className="grid grid-cols-2 divide-x divide-border">
        {[
          { artist: artist1, n: 1, streams: streams1, listeners: listeners1 },
          { artist: artist2, n: 2, streams: streams2, listeners: listeners2 },
        ].map(({ artist, n, streams, listeners }) => (
          <div key={n} className="p-4">
            <div className="flex items-center gap-3 mb-4">
              {artist.imageUrl && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted">
                  <Image
                    src={artist.imageUrl}
                    alt={artist.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <Link
                  href={`/artists/${artist.slug}`}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                >
                  {artist.name}
                </Link>
                {artist.originCountry && (
                  <p className="text-xs text-muted-foreground">
                    {artist.originCountry}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground/50 uppercase tracking-widest mb-0.5">
                  Total Streams
                </p>
                <p
                  className={`text-base font-bold tabular-nums ${
                    streamWinner === n ? "text-primary" : "text-foreground"
                  }`}
                >
                  {streams > 0 ? formatNumber(streams) : "—"}
                  {streamWinner === n && streams > 0 && (
                    <span className="text-xs ml-1">↑</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground/50 uppercase tracking-widest mb-0.5">
                  Monthly Listeners
                </p>
                <p
                  className={`text-base font-bold tabular-nums ${
                    listenerWinner === n ? "text-primary" : "text-foreground"
                  }`}
                >
                  {listeners > 0 ? formatNumber(listeners) : "—"}
                  {listenerWinner === n && listeners > 0 && (
                    <span className="text-xs ml-1">↑</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
