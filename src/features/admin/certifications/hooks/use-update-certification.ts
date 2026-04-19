"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { certificationsApi } from "../api/certifications.api";
import type { UpdateCertificationSchema } from "../schema/certification.schema";

export function useUpdateCertification(id: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = certificationsApi(axios);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateCertification(payload: UpdateCertificationSchema) {
    setLoading(true);
    setError(null);
    try {
      await api.update(id, payload);
      toast.success("Certification updated");
      onSuccess?.();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to update certification";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { updateCertification, loading, error };
}
