export interface Song {
  id: string;
  artistId: string;
  albumId: string | null;
  title: string;
  normalizedTitle: string;
  canonicalTitle: string | null;
  slug: string;
  spotifyTrackId: string | null;
  releaseDate: string | null;
  durationMs: number | null;
  explicit: boolean;
  isAfrobeats: boolean;
  imageUrl: string | null;
  entityStatus: string;
  sourceOfTruth: string | null;
  needsReview: boolean;
  mergedIntoSongId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SongWithRelations extends Song {
  aliases: SongAlias[];
  externalIds: SongExternalId[];
  features: SongFeature[];
}

export interface SongAlias {
  id: string;
  songId: string;
  alias: string;
  normalizedAlias: string;
  source: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface SongExternalId {
  id: string;
  songId: string;
  source: string;
  externalId: string;
  externalUrl: string | null;
  createdAt: string;
}

export interface SongFeature {
  id: string;
  songId: string;
  featuredArtistId: string;
  artistName: string;
  artistSlug: string;
}

export interface SongMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SongListResponse {
  data: Song[];
  meta: SongMeta;
}
