export interface Artist {
  id: string;
  name: string;
  normalizedName: string;
  canonicalName: string | null;
  spotifyId: string | null;
  slug: string;
  originCountry: string | null;
  debutYear: number | null;
  imageUrl: string | null;
  popularity: number | null;
  isAfrobeats: boolean;
  isAfrobeatsOverride: boolean;
  bio: string | null;
  entityStatus: string;
  sourceOfTruth: string | null;
  needsReview: boolean;
  mergedIntoArtistId: string | null;
  kworbStatus: string | null;
  kworbLastCheckedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistWithRelations extends Artist {
  aliases: ArtistAlias[];
  genres: ArtistGenre[];
  externalIds: ArtistExternalId[];
}

export interface ArtistAlias {
  id: string;
  artistId: string;
  alias: string;
  normalizedAlias: string;
  source: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface ArtistGenre {
  id: string;
  artistId: string;
  genre: string;
  isPrimary: boolean;
}

export interface ArtistExternalId {
  id: string;
  artistId: string;
  source: string;
  externalId: string;
  externalUrl: string | null;
  createdAt: string;
}

export interface ArtistMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArtistListResponse {
  data: Artist[];
  meta: ArtistMeta;
}
