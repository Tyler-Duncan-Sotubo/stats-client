import type { AxiosInstance } from "axios";
import type {
  Song,
  SongWithRelations,
  SongListResponse,
  SongAlias,
  SongExternalId,
  SongFeature,
} from "../types/song.types";
import type {
  CreateSongSchema,
  UpdateSongSchema,
  SongQuerySchema,
  CreateSongAliasSchema,
  CreateSongExternalIdSchema,
  CreateSongFeatureSchema,
} from "../schema/song.schema";

export const songsApi = (axios: AxiosInstance) => ({
  // ── List ──────────────────────────────────────────────────────────────────
  list: async (query: Partial<SongQuerySchema>): Promise<SongListResponse> => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.artistId) params.set("artistId", query.artistId);
    if (query.isAfrobeats !== undefined)
      params.set("isAfrobeats", String(query.isAfrobeats));
    if (query.entityStatus) params.set("entityStatus", query.entityStatus);
    if (query.needsReview !== undefined)
      params.set("needsReview", String(query.needsReview));
    if (query.explicit !== undefined)
      params.set("explicit", String(query.explicit));
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    const { data } = await axios.get(`/api/songs?${params.toString()}`);
    return data;
  },

  // ── Get one ───────────────────────────────────────────────────────────────
  get: async (id: string): Promise<SongWithRelations> => {
    const { data } = await axios.get(`/api/songs/${id}`);
    return data;
  },

  // ── Create ────────────────────────────────────────────────────────────────
  create: async (payload: CreateSongSchema): Promise<Song> => {
    const { data } = await axios.post("/api/songs", payload);
    return data;
  },

  // ── Update ────────────────────────────────────────────────────────────────
  update: async (id: string, payload: UpdateSongSchema): Promise<Song> => {
    const { data } = await axios.patch(`/api/songs/${id}`, payload);
    return data;
  },

  // ── Flag review ───────────────────────────────────────────────────────────
  flagReview: async (id: string, flag: boolean): Promise<Song> => {
    const { data } = await axios.patch(`/api/songs/${id}/flag-review`, {
      flag,
    });
    return data;
  },

  // ── Merge ─────────────────────────────────────────────────────────────────
  merge: async (sourceId: string, targetSongId: string): Promise<Song> => {
    const { data } = await axios.post(`/api/songs/${sourceId}/merge`, {
      targetSongId,
    });
    return data;
  },

  // ── Bulk update ───────────────────────────────────────────────────────────
  bulkUpdate: async (
    ids: string[],
    payload: {
      isAfrobeats?: boolean;
      needsReview?: boolean;
      entityStatus?: string;
    },
  ): Promise<Song[]> => {
    const { data } = await axios.patch("/api/songs/bulk", { ids, ...payload });
    return data;
  },

  // ── Delete ────────────────────────────────────────────────────────────────
  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/songs/${id}`);
  },

  // ── Aliases ───────────────────────────────────────────────────────────────
  getAliases: async (id: string): Promise<SongAlias[]> => {
    const { data } = await axios.get(`/api/songs/${id}/aliases`);
    return data;
  },

  addAlias: async (
    id: string,
    payload: CreateSongAliasSchema,
  ): Promise<SongAlias> => {
    const { data } = await axios.post(`/api/songs/${id}/aliases`, payload);
    return data;
  },

  setPrimaryAlias: async (id: string, aliasId: string): Promise<SongAlias> => {
    const { data } = await axios.patch(
      `/api/songs/${id}/aliases/${aliasId}/primary`,
    );
    return data;
  },

  deleteAlias: async (id: string, aliasId: string): Promise<void> => {
    await axios.delete(`/api/songs/${id}/aliases/${aliasId}`);
  },

  // ── External IDs ──────────────────────────────────────────────────────────
  getExternalIds: async (id: string): Promise<SongExternalId[]> => {
    const { data } = await axios.get(`/api/songs/${id}/external-ids`);
    return data;
  },

  addExternalId: async (
    id: string,
    payload: CreateSongExternalIdSchema,
  ): Promise<SongExternalId> => {
    const { data } = await axios.post(`/api/songs/${id}/external-ids`, payload);
    return data;
  },

  deleteExternalId: async (id: string, externalIdId: string): Promise<void> => {
    await axios.delete(`/api/songs/${id}/external-ids/${externalIdId}`);
  },

  // ── Features ──────────────────────────────────────────────────────────────
  getFeatures: async (id: string): Promise<SongFeature[]> => {
    const { data } = await axios.get(`/api/songs/${id}/features`);
    return data;
  },

  addFeature: async (
    id: string,
    payload: CreateSongFeatureSchema,
  ): Promise<SongFeature> => {
    const { data } = await axios.post(`/api/songs/${id}/features`, payload);
    return data;
  },

  deleteFeature: async (
    id: string,
    featuredArtistId: string,
  ): Promise<void> => {
    await axios.delete(`/api/songs/${id}/features/${featuredArtistId}`);
  },
});
