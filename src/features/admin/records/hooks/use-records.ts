"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { recordsApi } from "../api/records.api";
import type { RecordListResponse } from "../types/record.types";
import type { RecordQuerySchema } from "../schema/record.schema";

export function useRecords(initialQuery: Partial<RecordQuerySchema> = {}) {
  const axios = useAxiosAuth();
  const api = recordsApi(axios);

  const [data, setData] = useState<RecordListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<Partial<RecordQuerySchema>>({
    page: 1,
    limit: 20,
    ...initialQuery,
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.list(query);
      setData(result);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load records";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  function updateQuery(updates: Partial<RecordQuerySchema>) {
    setQuery((prev) => ({ ...prev, ...updates, page: 1 }));
  }

  function setPage(page: number) {
    setQuery((prev) => ({ ...prev, page }));
  }

  return { data, loading, error, query, updateQuery, setPage, refetch: fetch };
}
