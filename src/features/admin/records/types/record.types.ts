export interface Record {
  id: string;
  artistId: string | null;
  songId: string | null;
  albumId: string | null;
  recordType: string;
  recordValue: string;
  numericValue: number | null;
  scope: string;
  isActive: boolean;
  setOn: string | null;
  brokenOn: string | null;
  notes: string | null;
  artistName: string | null;
  artistSlug: string | null;
  songTitle: string | null;
  songSlug: string | null;
  albumTitle: string | null;
  albumSlug: string | null;
}

export interface RecordMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecordListResponse {
  data: Record[];
  meta: RecordMeta;
}
