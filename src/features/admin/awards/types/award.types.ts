export interface Award {
  id: string;
  artistId: string | null;
  songId: string | null;
  albumId: string | null;
  awardBody: string;
  awardName: string;
  category: string;
  result: string;
  year: number;
  ceremony: string | null;
  territory: string | null;
  sourceUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  artistName: string | null;
  artistSlug: string | null;
  songTitle: string | null;
  songSlug: string | null;
  albumTitle: string | null;
  albumSlug: string | null;
}

export interface AwardMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AwardListResponse {
  data: Award[];
  meta: AwardMeta;
}
