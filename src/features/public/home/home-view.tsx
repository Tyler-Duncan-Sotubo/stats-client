"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataTable } from "@/shared/ui/data-table";
import { songColumns } from "./song-columns";
import { artistColumns } from "./artist-columns";
import { chartColumns } from "./chart-columns";
import { AfrobeatsChartCard } from "./afrobeats-chart-card";
import { TrendingSongCard } from "./trending-song-card";
import { MostStreamedCard } from "./most-streamed-card";
import { MostListenersCard } from "./most-listeners-card";
import { FeaturedArtistCard } from "./featured-artist-card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { ListenerTicker } from "./listener-ticker";
import type {
  TrendingSong,
  ChartEntry,
  TrendingArtist,
  LeaderboardEntry,
  PublicArtist,
} from "@/lib/api/public";
import { GriotBanner } from "../layout/griot-banner";

type SongTab = "top20" | "trending";

interface HomeViewProps {
  songs: TrendingSong[];
  snapshotDate: string | null;
  tooxclusive: ChartEntry[];
  globalArtists: TrendingArtist[];
  topStreamedArtist: LeaderboardEntry | null;
  topListenerArtist: LeaderboardEntry | null;
  featuredArtists: PublicArtist[];
  ngListeners: LeaderboardEntry[];
}

export function HomeView({
  songs,
  snapshotDate,
  tooxclusive,
  globalArtists,
  topStreamedArtist,
  topListenerArtist,
  featuredArtists,
  ngListeners,
}: HomeViewProps) {
  const [songTab, setSongTab] = useState<SongTab>("top20");
  const router = useRouter();

  return (
    <div>
      {/* Outer grid — content | banner */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_350px] gap-6">
        {/* Left — all content */}
        <div className="flex flex-col gap-6">
          {/* Ticker */}
          <div className="">
            <ListenerTicker artists={ngListeners} />
          </div>

          {/* Inner 2-col grid — stat cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="flex flex-col gap-5">
              <AfrobeatsChartCard tooxclusive={tooxclusive} />
              <MostStreamedCard artist={topStreamedArtist} />
            </div>
            <div className="flex flex-col gap-5">
              <TrendingSongCard songs={songs} />
              <MostListenersCard artist={topListenerArtist} />
            </div>
          </div>

          {/* Featured Artists */}
          {featuredArtists.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
                  Compare Featured Artists
                </h2>
                <Link
                  href="/artists"
                  className="text-xs text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {featuredArtists.map((artist) => (
                  <FeaturedArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </div>
          )}

          {/* Inner 2-col grid — tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
                  Afrobeats Songs
                </h2>
                <div className="flex items-center gap-3">
                  <Link
                    href="/charts/tooxclusive_top_100/NG"
                    className="text-xs text-primary hover:underline"
                  >
                    Full chart
                  </Link>
                  <Tabs
                    value={songTab}
                    onValueChange={(v) => setSongTab(v as SongTab)}
                  >
                    <TabsList className="bg-transparent gap-1.5 p-0 h-auto">
                      <TabsTrigger value="trending">Trending</TabsTrigger>
                      <TabsTrigger value="top20">Top 20</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              {songTab === "trending" ? (
                <DataTable
                  columns={songColumns}
                  data={songs}
                  onRowClick={(s) => s.slug && router.push(`/songs/${s.slug}`)}
                  showResultsCount={false}
                />
              ) : (
                <DataTable
                  columns={chartColumns}
                  data={tooxclusive.slice(0, 20)}
                  onRowClick={(e) =>
                    e.songSlug && router.push(`/songs/${e.songSlug}`)
                  }
                  showResultsCount={false}
                />
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide text-muted-foreground">
                  Global Artists
                </h2>
                <Link
                  href="/leaderboard"
                  className="text-xs text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <DataTable
                columns={artistColumns}
                data={globalArtists}
                onRowClick={(a) => a.slug && router.push(`/artists/${a.slug}`)}
                showResultsCount={false}
              />
            </div>
          </div>
        </div>

        {/* Right — banner, sticky */}
        <div>
          <GriotBanner />
        </div>
      </div>
    </div>
  );
}
