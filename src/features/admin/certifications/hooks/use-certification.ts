"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { certificationsApi } from "../api/certifications.api";
import type { Certification } from "../types/certification.types";

export function useCertification(id: string) {
  const axios = useAxiosAuth();
  const api = certificationsApi(axios);

  const [certification, setCertification] = useState<Certification | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(id);
      setCertification(result);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to load certification";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { certification, loading, error, refetch: fetch };
}
