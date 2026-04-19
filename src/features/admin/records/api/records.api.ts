import type { AxiosInstance } from "axios";
import type { Record, RecordListResponse } from "../types/record.types";
import type {
  CreateRecordSchema,
  UpdateRecordSchema,
  BreakRecordSchema,
  RecordQuerySchema,
} from "../schema/record.schema";

export const recordsApi = (axios: AxiosInstance) => ({
  list: async (
    query: Partial<RecordQuerySchema>,
  ): Promise<RecordListResponse> => {
    const params = new URLSearchParams();
    if (query.artistId) params.set("artistId", query.artistId);
    if (query.songId) params.set("songId", query.songId);
    if (query.recordType) params.set("recordType", query.recordType);
    if (query.scope) params.set("scope", query.scope);
    if (query.isActive !== undefined)
      params.set("isActive", String(query.isActive));
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    const { data } = await axios.get(`/api/records?${params.toString()}`);
    return data;
  },

  get: async (id: string): Promise<Record> => {
    const { data } = await axios.get(`/api/records/${id}`);
    return data;
  },

  create: async (payload: CreateRecordSchema): Promise<Record> => {
    const { data } = await axios.post("/api/records", payload);
    return data;
  },

  update: async (id: string, payload: UpdateRecordSchema): Promise<Record> => {
    const { data } = await axios.patch(`/api/records/${id}`, payload);
    return data;
  },

  break: async (id: string, payload: BreakRecordSchema): Promise<Record> => {
    const { data } = await axios.post(`/api/records/${id}/break`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/records/${id}`);
  },
});
