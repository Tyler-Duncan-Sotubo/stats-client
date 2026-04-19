import type { AxiosInstance } from "axios";
import type {
  Artist,
  ArtistWithRelations,
  ArtistListResponse,
  ArtistAlias,
  ArtistGenre,
  ArtistExternalId,
} from "../types/artist.types";
import type {
  CreateArtistSchema,
  UpdateArtistSchema,
  ArtistQuerySchema,
  CreateAliasSchema,
  CreateGenreSchema,
  CreateExternalIdSchema,
} from "../schema/artist.schema";

export const artistsApi = (axios: AxiosInstance) => ({
  // ── List ──────────────────────────────────────────────────────────────────
  list: async (
    query: Partial<ArtistQuerySchema>,
  ): Promise<ArtistListResponse> => {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.originCountry) params.set("originCountry", query.originCountry);
    if (query.isAfrobeats !== undefined)
      params.set("isAfrobeats", String(query.isAfrobeats));
    if (query.entityStatus) params.set("entityStatus", query.entityStatus);
    if (query.needsReview !== undefined)
      params.set("needsReview", String(query.needsReview));
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));

    const { data } = await axios.get(`/api/artists?${params.toString()}`);
    return data;
  },

  // ── Get one ───────────────────────────────────────────────────────────────
  get: async (id: string): Promise<ArtistWithRelations> => {
    const { data } = await axios.get(`/api/artists/${id}`);
    return data;
  },

  // ── Create ────────────────────────────────────────────────────────────────
  create: async (payload: CreateArtistSchema): Promise<Artist> => {
    const { data } = await axios.post("/api/artists", payload);
    return data;
  },

  // ── Update ────────────────────────────────────────────────────────────────
  update: async (id: string, payload: UpdateArtistSchema): Promise<Artist> => {
    const { data } = await axios.patch(`/api/artists/${id}`, payload);
    return data;
  },

  // ── Flag review ───────────────────────────────────────────────────────────
  flagReview: async (id: string, flag: boolean): Promise<Artist> => {
    const { data } = await axios.patch(`/api/artists/${id}/flag-review`, {
      flag,
    });
    return data;
  },

  // ── Merge ─────────────────────────────────────────────────────────────────
  merge: async (sourceId: string, targetArtistId: string): Promise<Artist> => {
    const { data } = await axios.post(`/api/artists/${sourceId}/merge`, {
      targetArtistId,
    });
    return data;
  },

  // ── Bulk update ───────────────────────────────────────────────────────────
  bulkUpdate: async (
    ids: string[],
    payload: {
      originCountry?: string;
      isAfrobeats?: boolean;
      needsReview?: boolean;
    },
  ): Promise<Artist[]> => {
    const { data } = await axios.patch("/api/artists/bulk", {
      ids,
      ...payload,
    });
    return data;
  },

  // ── Delete ────────────────────────────────────────────────────────────────
  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/artists/${id}`);
  },

  // ── Aliases ───────────────────────────────────────────────────────────────
  getAliases: async (id: string): Promise<ArtistAlias[]> => {
    const { data } = await axios.get(`/api/artists/${id}/aliases`);
    return data;
  },

  addAlias: async (
    id: string,
    payload: CreateAliasSchema,
  ): Promise<ArtistAlias> => {
    const { data } = await axios.post(`/api/artists/${id}/aliases`, payload);
    return data;
  },

  setPrimaryAlias: async (
    id: string,
    aliasId: string,
  ): Promise<ArtistAlias> => {
    const { data } = await axios.patch(
      `/api/artists/${id}/aliases/${aliasId}/primary`,
    );
    return data;
  },

  deleteAlias: async (id: string, aliasId: string): Promise<void> => {
    await axios.delete(`/api/artists/${id}/aliases/${aliasId}`);
  },

  // ── Genres ────────────────────────────────────────────────────────────────
  getGenres: async (id: string): Promise<ArtistGenre[]> => {
    const { data } = await axios.get(`/api/artists/${id}/genres`);
    return data;
  },

  addGenre: async (
    id: string,
    payload: CreateGenreSchema,
  ): Promise<ArtistGenre> => {
    const { data } = await axios.post(`/api/artists/${id}/genres`, payload);
    return data;
  },

  setPrimaryGenre: async (
    id: string,
    genreId: string,
  ): Promise<ArtistGenre> => {
    const { data } = await axios.patch(
      `/api/artists/${id}/genres/${genreId}/primary`,
    );
    return data;
  },

  deleteGenre: async (id: string, genreId: string): Promise<void> => {
    await axios.delete(`/api/artists/${id}/genres/${genreId}`);
  },

  // ── External IDs ──────────────────────────────────────────────────────────
  getExternalIds: async (id: string): Promise<ArtistExternalId[]> => {
    const { data } = await axios.get(`/api/artists/${id}/external-ids`);
    return data;
  },

  addExternalId: async (
    id: string,
    payload: CreateExternalIdSchema,
  ): Promise<ArtistExternalId> => {
    const { data } = await axios.post(
      `/api/artists/${id}/external-ids`,
      payload,
    );
    return data;
  },

  deleteExternalId: async (id: string, externalIdId: string): Promise<void> => {
    await axios.delete(`/api/artists/${id}/external-ids/${externalIdId}`);
  },
});
