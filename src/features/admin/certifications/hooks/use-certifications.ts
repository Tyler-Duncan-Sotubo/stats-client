"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { certificationsApi } from "../api/certifications.api";
import type { CertificationListResponse } from "../types/certification.types";
import type { CertificationQuerySchema } from "../schema/certification.schema";

export function useCertifications(
  initialQuery: Partial<CertificationQuerySchema> = {},
) {
  const axios = useAxiosAuth();
  const api = certificationsApi(axios);

  const [data, setData] = useState<CertificationListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<Partial<CertificationQuerySchema>>({
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
      const msg =
        err?.response?.data?.message ?? "Failed to load certifications";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  function updateQuery(updates: Partial<CertificationQuerySchema>) {
    setQuery((prev) => ({ ...prev, ...updates, page: 1 }));
  }

  function setPage(page: number) {
    setQuery((prev) => ({ ...prev, page }));
  }

  return { data, loading, error, query, updateQuery, setPage, refetch: fetch };
}
