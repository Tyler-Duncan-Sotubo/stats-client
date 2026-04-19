"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { awardsApi } from "../api/awards.api";
import type { Award } from "../types/award.types";

export function useAward(id: string) {
  const axios = useAxiosAuth();
  const api = awardsApi(axios);

  const [award, setAward] = useState<Award | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(id);
      setAward(result);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load award";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { award, loading, error, refetch: fetch };
}
