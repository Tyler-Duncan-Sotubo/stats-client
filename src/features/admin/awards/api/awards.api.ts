import type { AxiosInstance } from "axios";
import type { Award, AwardListResponse } from "../types/award.types";
import type {
  CreateAwardSchema,
  UpdateAwardSchema,
  AwardQuerySchema,
} from "../schema/award.schema";

export const awardsApi = (axios: AxiosInstance) => ({
  list: async (
    query: Partial<AwardQuerySchema>,
  ): Promise<AwardListResponse> => {
    const params = new URLSearchParams();
    if (query.artistId) params.set("artistId", query.artistId);
    if (query.awardBody) params.set("awardBody", query.awardBody);
    if (query.category) params.set("category", query.category);
    if (query.result) params.set("result", query.result);
    if (query.territory) params.set("territory", query.territory);
    if (query.year) params.set("year", String(query.year));
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    const { data } = await axios.get(`/api/awards?${params.toString()}`);
    return data;
  },

  get: async (id: string): Promise<Award> => {
    const { data } = await axios.get(`/api/awards/${id}`);
    return data;
  },

  create: async (payload: CreateAwardSchema): Promise<Award> => {
    const { data } = await axios.post("/api/awards", payload);
    return data;
  },

  update: async (id: string, payload: UpdateAwardSchema): Promise<Award> => {
    const { data } = await axios.patch(`/api/awards/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/awards/${id}`);
  },
});
