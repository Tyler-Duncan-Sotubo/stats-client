"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { artistsApi } from "../api/artists.api";
import type { ArtistWithRelations } from "../types/artist.types";

export function useArtist(id: string) {
  const axios = useAxiosAuth();
  const api = artistsApi(axios);

  const [artist, setArtist] = useState<ArtistWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(id);
      setArtist(result);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to load artist";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { artist, loading, error, refetch: fetch };
}
