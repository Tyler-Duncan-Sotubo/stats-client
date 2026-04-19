"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { awardsApi } from "../api/awards.api";
import type { AwardListResponse } from "../types/award.types";
import type { AwardQuerySchema } from "../schema/award.schema";

export function useAwards(initialQuery: Partial<AwardQuerySchema> = {}) {
  const axios = useAxiosAuth();
  const api = awardsApi(axios);

  const [data, setData] = useState<AwardListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<Partial<AwardQuerySchema>>({
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
      const msg = err?.response?.data?.message ?? "Failed to load awards";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  function updateQuery(updates: Partial<AwardQuerySchema>) {
    setQuery((prev) => ({ ...prev, ...updates, page: 1 }));
  }

  function setPage(page: number) {
    setQuery((prev) => ({ ...prev, page }));
  }

  return { data, loading, error, query, updateQuery, setPage, refetch: fetch };
}
