const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
const PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status} — ${path}`);
  return res.json() as Promise<T>;
}

async function publicFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${PUBLIC_BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status} — ${path}`);
  return res.json() as Promise<T>;
}

async function embedFetch<T>(path: string, revalidate = 3600): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { next: { revalidate } });
  if (!res.ok) throw new Error(`API error ${res.status} — ${path}`);
  return res.json() as Promise<T>;
}

function buildQuery(
  params: Record<string, string | number | boolean | undefined>,
): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  return query.toString();
}

// ── Sitemaps ──────────────────────────────────────────────────────────────────

export function getIndexableArtists(limit: number, offset: number) {
  return apiFetch<{ slug: string; updatedAt: string }[]>(
    `/api/public/artists/indexable?limit=${limit}&offset=${offset}`,
  );
}

export function getIndexableSongs(limit: number, offset: number) {
  return apiFetch<{ slug: string; updatedAt: string; totalStreams: number }[]>(
    `/api/public/songs/indexable?limit=${limit}&offset=${offset}`,
  );
}

export function getIndexableQuestions() {
  return apiFetch<IndexableQuestion[]>(`/api/public/ask/indexable`);
}

// ── Artists ───────────────────────────────────────────────────────────────────

export function getArtist(slug: string) {
  return apiFetch<PublicArtist>(`/api/public/artists/${slug}`);
}

export function getArtists(params?: ArtistBrowseParams) {
  const q = buildQuery({
    limit: params?.limit,
    page: params?.page,
    letter: params?.letter,
    country: params?.country,
    isAfrobeats: params?.isAfrobeats,
    sortBy: params?.sortBy,
  });
  return apiFetch<ArtistBrowseResponse>(`/api/public/artists?${q}`);
}

export function getArtistHistory(slug: string) {
  return apiFetch<ArtistHistoryPoint[]>(`/api/public/artists/${slug}/history`);
}

export function suggestArtists(params?: ArtistBrowseParams) {
  const q = buildQuery({
    limit: params?.limit,
    page: params?.page,
    letter: params?.letter,
    country: params?.country,
    isAfrobeats: params?.isAfrobeats,
    sortBy: params?.sortBy,
  });
  return publicFetch<ArtistBrowseResponse>(`/api/public/artists?${q}`);
}

export function compareSuggestArtist(slug: string) {
  return publicFetch<PublicArtist>(`/api/public/artists/${slug}`);
}

// ── Songs ─────────────────────────────────────────────────────────────────────

export function getSong(slug: string) {
  return apiFetch<PublicSong>(`/api/public/songs/${slug}`);
}

export function getSongHistory(slug: string) {
  return apiFetch<SongHistoryPoint[]>(`/api/public/songs/${slug}/history`);
}

export function getArtistSongs(slug: string, limit = 20) {
  return apiFetch<ArtistSongEntry[]>(
    `/api/public/songs/${slug}/songs?limit=${limit}`,
  );
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
  const q = buildQuery({
    limit: params?.limit,
    isAfrobeats: params?.isAfrobeats,
    country: params?.country,
  });
  return apiFetch<LeaderboardResponse>(`/api/public/leaderboard/streams?${q}`);
}

export function getListenerLeaderboard(params?: {
  limit?: number;
  isAfrobeats?: boolean;
  country?: string;
}) {
  const q = buildQuery({
    limit: params?.limit,
    isAfrobeats: params?.isAfrobeats,
    country: params?.country,
  });
  return apiFetch<LeaderboardResponse>(
    `/api/public/leaderboard/listeners?${q}`,
  );
}

export function getSongLeaderboard(params?: {
  limit?: number;
  isAfrobeats?: boolean;
}) {
  const q = buildQuery({
    limit: params?.limit,
    isAfrobeats: params?.isAfrobeats,
  });
  return apiFetch<LeaderboardResponse>(`/api/public/leaderboard/songs?${q}`);
}

// ── Trending ──────────────────────────────────────────────────────────────────

export function getTrendingArtists(params?: {
  limit?: number;
  isAfrobeats?: boolean;
  country?: string;
}) {
  const q = buildQuery({
    limit: params?.limit,
    isAfrobeats: params?.isAfrobeats,
    country: params?.country,
  });
  return apiFetch<TrendingArtistsResponse>(`/api/public/trending/artists?${q}`);
}

export function getTrendingSongs(params?: {
  limit?: number;
  isAfrobeats?: boolean;
}) {
  const q = buildQuery({
    limit: params?.limit,
    isAfrobeats: params?.isAfrobeats,
  });
  return apiFetch<TrendingSongsResponse>(`/api/public/trending/songs?${q}`);
}

// ── Milestones ────────────────────────────────────────────────────────────────

export function getMilestoneCounts() {
  return apiFetch<MilestoneCountsResponse>(`/api/public/milestones`);
}

export function getArtistMilestone(params: {
  tier: string;
  isAfrobeats?: boolean;
  page?: number;
  limit?: number;
}) {
  const q = buildQuery({
    isAfrobeats: params.isAfrobeats,
    page: params.page,
    limit: params.limit,
  });
  return apiFetch<MilestoneArtistResponse>(
    `/api/public/milestones/artists/${params.tier}?${q}`,
  );
}

export function getSongMilestone(params: {
  tier: string;
  page?: number;
  limit?: number;
}) {
  const q = buildQuery({ page: params.page, limit: params.limit });
  return apiFetch<MilestoneSongResponse>(
    `/api/public/milestones/songs/${params.tier}?${q}`,
  );
}

export function getRecentMilestones(params?: {
  isAfrobeats?: boolean;
  page?: number;
  limit?: number;
}) {
  const q = buildQuery({
    isAfrobeats: params?.isAfrobeats,
    page: params?.page,
    limit: params?.limit,
  });
  return apiFetch<RecentMilestonesResponse>(
    `/api/public/milestones/recent?${q}`,
  );
}

export function getArtistMilestoneTimeline(artistSlug: string) {
  return apiFetch<ArtistMilestoneTimelineEntry[]>(
    `/api/public/milestones/timeline/${artistSlug}`,
  );
}

// ── Milestone facts ───────────────────────────────────────────────────────────

export function getArtistStreamFact(artistSlug: string, threshold: number) {
  return apiFetch<MilestoneFact>(
    `/api/public/milestones/facts/${artistSlug}/streams/${threshold}`,
  );
}

export function getArtistListenerFact(artistSlug: string, threshold: number) {
  return apiFetch<MilestoneFact>(
    `/api/public/milestones/facts/${artistSlug}/listeners/${threshold}`,
  );
}

export function getSongStreamFact(
  artistSlug: string,
  songSlug: string,
  threshold: number,
) {
  return apiFetch<MilestoneFact>(
    `/api/public/milestones/facts/${artistSlug}/songs/${songSlug}/streams/${threshold}`,
  );
}

export function getIndexableMilestoneFacts(limit: number, offset: number) {
  return apiFetch<
    {
      slug: string;
      updatedAt: string;
      artistSlug: string;
      metric: string;
      threshold: number;
      songSlug: string | null;
    }[]
  >(`/api/public/milestones/facts/indexable?limit=${limit}&offset=${offset}`);
}

// ── Ask ───────────────────────────────────────────────────────────────────────

export async function askQuestion(question: string): Promise<AskResult> {
  const res = await fetch(`${PUBLIC_BASE_URL}/api/public/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error(`Ask API error ${res.status}`);
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

// ── Embed (ISR cached) ────────────────────────────────────────────────────────

export function getArtistCached(slug: string, revalidate = 3600) {
  return embedFetch<PublicArtist>(`/api/public/artists/${slug}`, revalidate);
}

export function getChartCached(
  chartName: string,
  territory: string,
  limit = 10,
  revalidate = 1800,
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
  const q = buildQuery({
    limit: params?.limit,
    isAfrobeats: params?.isAfrobeats,
    country: params?.country,
  });
  return embedFetch<TrendingArtistsResponse>(
    `/api/public/trending/artists?${q}`,
    revalidate,
  );
}

// Ranking ─────────────────────────────────────────────────────────────────────

export function getArtistSongRanking(slug: string, revalidate = 86400) {
  return embedFetch<ArtistSongRankingResponse>(
    `/api/public/rankings/${slug}`,
    revalidate,
  );
}

// ── Albums ────────────────────────────────────────────────────────────────────

export function getAlbum(slug: string) {
  return apiFetch<FullAlbum>(`/api/public/albums/${slug}`);
}

export function getAlbums(params?: AlbumBrowseParams) {
  const q = buildQuery({
    limit: params?.limit,
    page: params?.page,
    isAfrobeats: params?.isAfrobeats,
    albumType: params?.albumType,
    sortBy: params?.sortBy,
  });
  return apiFetch<AlbumBrowseResponse>(`/api/public/albums?${q}`);
}

export function getIndexableAlbums(limit: number, offset: number) {
  return apiFetch<{ slug: string; updatedAt: string }[]>(
    `/api/public/albums/indexable?limit=${limit}&offset=${offset}`,
  );
}

export function getAlbumCached(slug: string, revalidate = 3600) {
  return embedFetch<FullAlbum>(`/api/public/albums/${slug}`, revalidate);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ArtistSongRankingResponse {
  data: ArtistSong[];
  meta: {
    artistSlug: string;
    artistName: string;
    artistImage: string | null;
    limit: number;
    metric: string;
    total: number;
    slug: string;
    generatedAt: string;
  };
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
  meta: { total: number; page: number; limit: number; totalPages: number };
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
  awardsSummary: ArtistAwardsSummary;
  audiomackStats: AudiomackStats | null;
  rankContext: any;
  albums: PublicAlbum[];
}

export interface ArtistAwardsSummary {
  totalWins: number;
  totalNominations: number;
  grammyWins: number;
  grammyNominations: number;
}

export interface AudiomackStats {
  audiomackSlug: string;
  snapshotDate: string;
  totalPlays: string;
  monthlyPlays: string;
  followers: string;
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

export interface ArtistHistoryPoint {
  date: string;
  totalStreams: number | null;
  dailyStreams: number | null;
  dailyGrowth: number | null;
  growth7d: number | null;
}

export interface ArtistSongEntry {
  id: string;
  title: string;
  slug: string | null;
  imageUrl: string | null;
  releaseDate: string | null;
  spotifyTrackId: string | null;
  isAfrobeats: boolean;
  explicit: boolean;
  totalStreams: number | null;
  dailyStreams: number | null;
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

export interface SongHistoryPoint {
  date: string;
  totalStreams: number | null;
  dailyStreams: number | null;
  dailyGrowth: number | null;
  growth7d: number | null;
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

export interface MilestoneCountsResponse {
  artists: Record<string, number>;
  songs: Record<string, number>;
  afrobeatsArtists: Record<string, number>;
}

export interface MilestoneArtistEntry {
  rank: number;
  artistId: string;
  artistName: string;
  artistSlug: string | null;
  imageUrl: string | null;
  originCountry: string | null;
  isAfrobeats: boolean;
  totalStreams: number;
  dailyStreams: number | null;
}

export interface MilestoneSongEntry {
  rank: number;
  songId: string;
  songTitle: string;
  songSlug: string | null;
  imageUrl: string | null;
  artistId: string;
  artistName: string;
  artistSlug: string | null;
  isAfrobeats: boolean;
  totalStreams: number;
  dailyStreams: number | null;
  releaseDate: string | null;
}

export interface MilestoneArtistResponse {
  data: MilestoneArtistEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    threshold: number;
    tier: string;
  };
}

export interface MilestoneSongResponse {
  data: MilestoneSongEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    threshold: number;
    tier: string;
  };
}

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

export interface IndexableSong {
  slug: string;
  updatedAt: string;
}

export interface IndexableQuestion {
  slug: string;
  updatedAt: string;
  question: string;
}

// ── Album types ───────────────────────────────────────────────────────────────

export interface AlbumBrowseParams {
  limit?: number;
  page?: number;
  isAfrobeats?: boolean;
  albumType?: string;
  sortBy?: "totalStreams" | "releaseDate" | "dailyStreams";
}

export interface AlbumBrowseResponse {
  data: PublicAlbum[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface PublicAlbum {
  id: string;
  title: string;
  slug: string;
  imageUrl: string | null;
  releaseDate: string | null;
  albumType: string;
  totalTracks: number | null;
  spotifyAlbumId: string;
  isAfrobeats: boolean;
  artistId: string;
  artistName: string;
  artistSlug: string;
  artistImageUrl: string | null;
  totalStreams: number | null;
  dailyStreams: number | null;
}

export interface PublicAlbumTrack {
  id: string;
  title: string;
  slug: string | null;
  trackNumber: number | null;
  spotifyTrackId: string | null;
  imageUrl: string | null;
  explicit: boolean;
  durationMs: number | null;
  releaseDate: string | null;
  totalStreams: number | null;
  dailyStreams: number | null;
  featuredArtists: {
    id: string;
    name: string;
    slug: string | null;
  }[];
}

export interface FullAlbum {
  album: PublicAlbum;
  tracklist: PublicAlbumTrack[];
}

export interface RecentMilestone {
  id: string;
  metric: string;
  threshold: number;
  crossedAt: string;
  isAfrobeats: boolean;
  streamValue: number | null;
  artistId: string | null;
  artistName: string | null;
  artistSlug: string | null;
  artistImageUrl: string | null;
  songId: string | null;
  songTitle: string | null;
  songSlug: string | null;
  songImageUrl: string | null;
}

export interface RecentMilestonesResponse {
  data: RecentMilestone[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ArtistMilestoneTimelineEntry {
  metric: string;
  threshold: number;
  crossedAt: string;
  streamValue: number | null;
}

export interface MilestoneFact {
  id: string;
  metric: string;
  threshold: number;
  crossedAt: string;
  isAfrobeats: boolean;
  streamValue: number | null;
  artistId: string;
  artistName: string;
  artistSlug: string;
  artistImageUrl: string | null;
  originCountry: string | null;
  spotifyId: string | null;
  songId: string | null;
  songTitle: string | null;
  songSlug: string | null;
  songImageUrl: string | null;
  spotifyTrackId: string | null;
  currentArtistStreams: number;
  currentSongStreams: number;
  artistMilestones: {
    metric: string;
    threshold: number;
    crossedAt: string;
  }[];
}
