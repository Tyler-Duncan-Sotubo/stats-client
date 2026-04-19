"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { recordsApi } from "../api/records.api";
import type { BreakRecordSchema } from "../schema/record.schema";

export function useBreakRecord(id: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = recordsApi(axios);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function breakRecord(payload: BreakRecordSchema) {
    setLoading(true);
    setError(null);
    try {
      await api.break(id, payload);
      toast.success("Record marked as broken");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to break record";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { breakRecord, loading, error };
}
