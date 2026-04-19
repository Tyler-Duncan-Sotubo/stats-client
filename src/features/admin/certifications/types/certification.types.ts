export interface Certification {
  id: string;
  artistId: string | null;
  songId: string | null;
  albumId: string | null;
  territory: string;
  body: string;
  title: string;
  level: string;
  units: number | null;
  certifiedAt: string | null;
  sourceUrl: string | null;
  rawArtistName: string | null;
  rawTitle: string | null;
  resolutionStatus: string;
  createdAt: string;
  updatedAt: string;
  artistName: string | null;
  artistSlug: string | null;
  songTitle: string | null;
  songSlug: string | null;
}

export interface CertificationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CertificationListResponse {
  data: Certification[];
  meta: CertificationMeta;
}
