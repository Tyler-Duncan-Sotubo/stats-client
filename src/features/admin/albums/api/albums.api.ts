import type { AxiosInstance } from "axios";
import type {
  Album,
  AlbumWithSongs,
  AlbumListResponse,
} from "../types/album.types";
import type {
  CreateAlbumSchema,
  UpdateAlbumSchema,
  AlbumQuerySchema,
} from "../schema/album.schema";

export const albumsApi = (axios: AxiosInstance) => ({
  list: async (
    query: Partial<AlbumQuerySchema>,
  ): Promise<AlbumListResponse> => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.artistId) params.set("artistId", query.artistId);
    if (query.albumType) params.set("albumType", query.albumType);
    if (query.isAfrobeats !== undefined)
      params.set("isAfrobeats", String(query.isAfrobeats));
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    const { data } = await axios.get(`/api/albums?${params.toString()}`);
    return data;
  },

  get: async (id: string): Promise<AlbumWithSongs> => {
    const { data } = await axios.get(`/api/albums/${id}`);
    return data;
  },

  create: async (payload: CreateAlbumSchema): Promise<Album> => {
    const { data } = await axios.post("/api/albums", payload);
    return data;
  },

  update: async (id: string, payload: UpdateAlbumSchema): Promise<Album> => {
    const { data } = await axios.patch(`/api/albums/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/albums/${id}`);
  },
});
