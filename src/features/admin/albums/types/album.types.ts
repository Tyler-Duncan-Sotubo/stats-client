export interface Album {
  id: string;
  artistId: string;
  title: string;
  slug: string;
  spotifyAlbumId: string;
  albumType: string;
  releaseDate: string | null;
  imageUrl: string | null;
  totalTracks: number | null;
  isAfrobeats: boolean;
  createdAt: string;
  artistName: string | null;
  artistSlug: string | null;
}

export interface AlbumWithSongs extends Album {
  songs: AlbumSong[];
}

export interface AlbumSong {
  id: string;
  title: string;
  slug: string;
  spotifyTrackId: string | null;
  releaseDate: string | null;
  durationMs: number | null;
  explicit: boolean;
  isAfrobeats: boolean;
  entityStatus: string;
}

export interface AlbumMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AlbumListResponse {
  data: Album[];
  meta: AlbumMeta;
}
