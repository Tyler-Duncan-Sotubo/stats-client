"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { artistsApi } from "../api/artists.api";
import type { Artist, ArtistListResponse } from "../types/artist.types";
import type { ArtistQuerySchema } from "../schema/artist.schema";

export function useArtists(initialQuery: Partial<ArtistQuerySchema> = {}) {
  const axios = useAxiosAuth();
  const api = artistsApi(axios);

  const [data, setData] = useState<ArtistListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<Partial<ArtistQuerySchema>>({
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
      const msg = err?.response?.data?.message ?? "Failed to load artists";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  function updateQuery(updates: Partial<ArtistQuerySchema>) {
    setQuery((prev) => ({ ...prev, ...updates, page: 1 }));
  }

  function setPage(page: number) {
    setQuery((prev) => ({ ...prev, page }));
  }

  return { data, loading, error, query, updateQuery, setPage, refetch: fetch };
}
