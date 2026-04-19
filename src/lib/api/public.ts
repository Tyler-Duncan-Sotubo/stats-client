const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
const PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function embedFetch<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate }, // ← ISR cache, revalidate every hour
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} — ${path}`);
  }

  return res.json() as Promise<T>;
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} — ${path}`);
  }

  return res.json() as Promise<T>;
}

async function publicFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${PUBLIC_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status} — ${path}`);
  }

  return res.json() as Promise<T>;
}

// ── Trending ──────────────────────────────────────────────────────────────────

export function getTrendingArtists(params?: {
  limit?: number;
  isAfrobeats?: boolean;
  country?: string;
}) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.isAfrobeats !== undefined)
    query.set("isAfrobeats", String(params.isAfrobeats));
  if (params?.country) query.set("country", params.country);

  return apiFetch<TrendingArtistsResponse>(
    `/api/public/trending/artists?${query}`,
  );
}

export function getTrendingSongs(params?: {
  limit?: number;
  isAfrobeats?: boolean;
}) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.isAfrobeats !== undefined)
    query.set("isAfrobeats", String(params.isAfrobeats));

  return apiFetch<TrendingSongsResponse>(`/api/public/trending/songs?${query}`);
}

// ── Artists ───────────────────────────────────────────────────────────────────

export function getArtist(slug: string) {
  return apiFetch<PublicArtist>(`/api/public/artists/${slug}`);
}

export function getArtists(params?: ArtistBrowseParams) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.page) query.set("page", String(params.page));
  if (params?.letter) query.set("letter", params.letter);
  if (params?.country) query.set("country", params.country);
  if (params?.isAfrobeats !== undefined)
    query.set("isAfrobeats", String(params.isAfrobeats));
  if (params?.sortBy) query.set("sortBy", params.sortBy);

  return apiFetch<ArtistBrowseResponse>(`/api/public/artists?${query}`);
}

// ── Songs ─────────────────────────────────────────────────────────────────────

export function getSong(slug: string) {
  return apiFetch<PublicSong>(`/api/public/songs/${slug}`);
}

// ── Charts ────────────────────────────────────────────────────────────────────

export function getAvailableCharts() {
  return apiFetch<AvailableChart[]>(`/api/public/charts`);
}

export function getChart(chartName: string, territory: string, limit = 100) {
  return apiFetch<ChartResponse>(
    `/api/public/charts/${chartName}/${territory}?limit=${limit}`,
  );
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export function getStreamLeaderboard(params?: {
  limit?: number;
  isAfrobeats?: boolean;
  country?: string;
}) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.isAfrobeats !== undefined)
    query.set("isAfrobeats", String(params.isAfrobeats));
  if (params?.country) query.set("country", params.country);

  return apiFetch<LeaderboardResponse>(
    `/api/public/leaderboard/streams?${query}`,
  );
}

export function getListenerLeaderboard(params?: {
  limit?: number;
  isAfrobeats?: boolean;
  country?: string;
}) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.isAfrobeats !== undefined)
    query.set("isAfrobeats", String(params.isAfrobeats));
  if (params?.country) query.set("country", params.country);

  return apiFetch<LeaderboardResponse>(
    `/api/public/leaderboard/listeners?${query}`,
  );
}

export function getSongLeaderboard(params?: {
  limit?: number;
  isAfrobeats?: boolean;
}) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.isAfrobeats !== undefined)
    query.set("isAfrobeats", String(params.isAfrobeats));

  return apiFetch<LeaderboardResponse>(
    `/api/public/leaderboard/songs?${query}`,
  );
}

// ── Ask ───────────────────────────────────────────────────────────────────────

export interface AskResult {
  answer: string;
  toolUsed: string | null;
  data: any;
  slug: string | null;
}

export interface AskQuestion {
  id: string;
  question: string;
  slug: string;
  toolUsed: string | null;
  answer: string | null;
  askCount: number;
  lastAsked: string | null;
  createdAt: string | null;
}

export async function askQuestion(question: string): Promise<AskResult> {
  const res = await fetch(`${PUBLIC_BASE_URL}/api/public/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error(`Ask API error ${res.status}`);
  }

  return res.json() as Promise<AskResult>;
}

export function getPopularQuestions(limit = 10) {
  return apiFetch<AskQuestion[]>(`/api/public/ask/popular?limit=${limit}`);
}

export function getRecentQuestions(limit = 10) {
  return apiFetch<AskQuestion[]>(`/api/public/ask/recent?limit=${limit}`);
}

export function getAskStats() {
  return apiFetch<{
    totalQuestions: number;
    totalAsks: number;
    topTool: string | null;
  }>(`/api/public/ask/stats`);
}

export function suggestQuestions(q: string, limit = 5) {
  return publicFetch<AskQuestion[]>(
    `/api/public/ask/suggest?q=${encodeURIComponent(q)}&limit=${limit}`,
  );
}

export function getIndexableQuestions() {
  return apiFetch<IndexableQuestion[]>(`/api/public/ask/indexable`);
}

export function getIndexableSongs() {
  return apiFetch<IndexableSong[]>(`/api/public/songs/indexable`);
}

// Embed-specific functions — cached heavily  ─────────────────────────────────────────────────────────────────────
export function getArtistCached(slug: string, revalidate = 3600) {
  return embedFetch<PublicArtist>(`/api/public/artists/${slug}`, revalidate);
}

export function getChartCached(
  chartName: string,
  territory: string,
  limit = 10,
  revalidate = 1800, // 30 mins — charts update more often
) {
  return embedFetch<ChartResponse>(
    `/api/public/charts/${chartName}/${territory}?limit=${limit}`,
    revalidate,
  );
}

export function getTrendingArtistsCached(
  params?: { limit?: number; isAfrobeats?: boolean; country?: string },
  revalidate = 1800,
) {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.isAfrobeats !== undefined)
    query.set("isAfrobeats", String(params.isAfrobeats));
  if (params?.country) query.set("country", params.country);

  return embedFetch<TrendingArtistsResponse>(
    `/api/public/trending/artists?${query}`,
    revalidate,
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface IndexableSong {
  slug: string;
  updatedAt: string;
}

export interface IndexableQuestion {
  slug: string;
  updatedAt: string;
}

export interface ArtistBrowseParams {
  limit?: number;
  page?: number;
  letter?: string;
  country?: string;
  isAfrobeats?: boolean;
  sortBy?: "name" | "totalStreams" | "monthlyListeners";
}

export interface ArtistBrowseResponse {
  data: BrowseArtist[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BrowseArtist {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  originCountry: string | null;
  isAfrobeats: boolean;
  totalStreams: number | null;
  monthlyListeners: number | null;
}

export interface TrendingArtistsResponse {
  data: TrendingArtist[];
  meta: { total: number; snapshotDate: string | null };
}

export interface TrendingSongsResponse {
  data: TrendingSong[];
  meta: { total: number; snapshotDate: string | null };
}

export interface TrendingArtist {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  originCountry: string | null;
  isAfrobeats: boolean;
  spotifyId: string | null;
  snapshotDate: string;
  dailyStreams: number | null;
  dailyGrowth: number | null;
  growth7d: number | null;
  momentumScore: number | null;
  totalStreams: number | null;
  monthlyListeners: number | null;
  bestChartPeak: number | null;
  bestChartName: string | null;
  bestChartTerritory: string | null;
}

export interface TrendingSong {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string | null;
  spotifyTrackId: string | null;
  isAfrobeats: boolean;
  artistId: string;
  artistName: string | null;
  artistSlug: string | null;
  artistImageUrl: string | null;
  snapshotDate: string;
  dailyStreams: number | null;
  dailyGrowth: number | null;
  growth7d: number | null;
  momentumScore: number | null;
  totalStreams: number | null;
  bestChartPeak: number | null;
  bestChartName: string | null;
  bestChartTerritory: string | null;
}

export interface PublicArtist {
  id: string;
  name: string;
  slug: string | null;
  imageUrl: string | null;
  originCountry: string | null;
  isAfrobeats: boolean;
  spotifyId: string | null;
  popularity: number | null;
  totalStreams: number | null;
  totalStreamsAsLead: number | null;
  totalStreamsAsFeature: number | null;
  dailyStreams: number | null;
  trackCount: number | null;
  streamSnapshotDate: string | null;
  monthlyListeners: number | null;
  dailyListenerChange: number | null;
  peakListeners: number | null;
  listenerSnapshotDate: string | null;
  certifications: ArtistCertification[];
  charts: ArtistChart[];
  records: ArtistRecord[];
  awards: ArtistAward[];
  topSongs: ArtistSong[];
}

export interface ArtistCertification {
  territory: string;
  body: string;
  totalCertifications: number;
  diamondCount: number;
  platinumCount: number;
  goldCount: number;
  silverCount: number;
  totalPlatinumUnits: number;
  latestCertification: string | null;
}

export interface ArtistChart {
  chartName: string;
  chartTerritory: string;
  role: string;
  bestPeakPosition: number | null;
  weeksAtNumber1: number;
  weeksInTop10: number;
  totalChartWeeks: number;
  distinctSongsCharted: number;
  firstChartAppearance: string | null;
  latestChartAppearance: string | null;
}

export interface ArtistRecord {
  id: string;
  recordType: string;
  recordValue: string;
  numericValue: number | null;
  scope: string;
  isActive: boolean;
  setOn: string | null;
  notes: string | null;
}

export interface ArtistAward {
  id: string;
  awardBody: string;
  awardName: string;
  category: string;
  result: string;
  year: number;
  ceremony: string | null;
  territory: string | null;
}

export interface ArtistSong {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string | null;
  spotifyTrackId: string | null;
  totalStreams: number | null;
  dailyStreams: number | null;
  releaseDate: string | null;
}

export interface PublicSong {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string | null;
  spotifyTrackId: string | null;
  isAfrobeats: boolean;
  explicit: boolean;
  releaseDate: string | null;
  artistId: string;
  artistName: string | null;
  artistSlug: string | null;
  artistImageUrl: string | null;
  artistOriginCountry: string | null;
  totalStreams: number | null;
  dailyStreams: number | null;
  streamSnapshotDate: string | null;
  charts: SongChart[];
  features: SongFeature[];
}

export interface SongChart {
  chartName: string;
  chartTerritory: string;
  peakPosition: number | null;
  weeksAtNumber1: number;
  weeksInTop10: number;
  totalChartWeeks: number;
  firstCharted: string | null;
  lastCharted: string | null;
}

export interface SongFeature {
  artistId: string;
  artistName: string | null;
  artistSlug: string | null;
  artistImageUrl: string | null;
}

export interface AvailableChart {
  chartName: string;
  chartTerritory: string;
  latestWeek: string;
  totalEntries: number;
}

export interface ChartResponse {
  chartName: string;
  chartTerritory: string;
  chartWeek: string | null;
  data: ChartEntry[];
  meta: { total: number };
}

export interface ChartEntry {
  entryId: string;
  songId: string;
  artistId: string;
  chartName: string;
  chartTerritory: string;
  position: number;
  peakPosition: number | null;
  weeksOnChart: number | null;
  chartWeek: string;
  prevRank: number | null;
  delta: number | null;
  trend: string | null;
  songTitle: string;
  songSlug: string | null;
  songImageUrl: string | null;
  spotifyTrackId: string | null;
  artistName: string;
  artistSlug: string | null;
  artistImageUrl: string | null;
  isAfrobeats: boolean;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  meta: { total: number };
}

export interface LeaderboardEntry {
  rank: number;
  artistId?: string;
  songId?: string;
  artistName?: string;
  songTitle?: string;
  artistSlug?: string;
  songSlug?: string;
  artistImageUrl?: string;
  songImageUrl?: string;
  originCountry?: string;
  isAfrobeats?: boolean;
  totalStreams?: number | null;
  dailyStreams?: number | null;
  monthlyListeners?: number | null;
  dailyChange?: number | null;
  peakListeners?: number | null;
  globalRank?: number | null;
}
