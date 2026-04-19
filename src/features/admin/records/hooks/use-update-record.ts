"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { recordsApi } from "../api/records.api";
import type { UpdateRecordSchema } from "../schema/record.schema";

export function useUpdateRecord(id: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = recordsApi(axios);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateRecord(payload: UpdateRecordSchema) {
    setLoading(true);
    setError(null);
    try {
      await api.update(id, payload);
      toast.success("Record updated");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update record";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { updateRecord, loading, error };
}
