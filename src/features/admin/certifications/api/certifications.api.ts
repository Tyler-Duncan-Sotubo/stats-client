import type { AxiosInstance } from "axios";
import type {
  Certification,
  CertificationListResponse,
} from "../types/certification.types";
import type {
  CreateCertificationSchema,
  UpdateCertificationSchema,
  CertificationQuerySchema,
} from "../schema/certification.schema";

export const certificationsApi = (axios: AxiosInstance) => ({
  list: async (
    query: Partial<CertificationQuerySchema>,
  ): Promise<CertificationListResponse> => {
    const params = new URLSearchParams();
    if (query.artistId) params.set("artistId", query.artistId);
    if (query.songId) params.set("songId", query.songId);
    if (query.territory) params.set("territory", query.territory);
    if (query.body) params.set("body", query.body);
    if (query.level) params.set("level", query.level);
    if (query.resolutionStatus)
      params.set("resolutionStatus", query.resolutionStatus);
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    const { data } = await axios.get(
      `/api/certifications?${params.toString()}`,
    );
    return data;
  },

  get: async (id: string): Promise<Certification> => {
    const { data } = await axios.get(`/api/certifications/${id}`);
    return data;
  },

  create: async (
    payload: CreateCertificationSchema,
  ): Promise<Certification> => {
    const { data } = await axios.post("/api/certifications", payload);
    return data;
  },

  update: async (
    id: string,
    payload: UpdateCertificationSchema,
  ): Promise<Certification> => {
    const { data } = await axios.patch(`/api/certifications/${id}`, payload);
    return data;
  },

  bulkResolve: async (
    ids: string[],
    resolutionStatus: string,
  ): Promise<Certification[]> => {
    const { data } = await axios.patch("/api/certifications/bulk-resolve", {
      ids,
      resolutionStatus,
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/certifications/${id}`);
  },
});
