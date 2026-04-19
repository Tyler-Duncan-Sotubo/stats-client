"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { awardsApi } from "../api/awards.api";
import type { UpdateAwardSchema } from "../schema/award.schema";

export function useUpdateAward(id: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = awardsApi(axios);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateAward(payload: UpdateAwardSchema) {
    setLoading(true);
    setError(null);
    try {
      await api.update(id, payload);
      toast.success("Award updated");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update award";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { updateAward, loading, error };
}
