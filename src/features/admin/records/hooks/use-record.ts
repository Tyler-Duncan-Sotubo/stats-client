"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { recordsApi } from "../api/records.api";
import type { Record } from "../types/record.types";

export function useRecord(id: string) {
  const axios = useAxiosAuth();
  const api = recordsApi(axios);

  const [record, setRecord] = useState<Record | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(id);
      setRecord(result);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load record";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { record, loading, error, refetch: fetch };
}
