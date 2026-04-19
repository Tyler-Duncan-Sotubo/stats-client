"use client";

import { useEffect, useState, useCallback } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { albumsApi } from "../api/albums.api";
import type { AlbumListResponse } from "../types/album.types";
import type { AlbumQuerySchema } from "../schema/album.schema";

export function useAlbums(initialQuery: Partial<AlbumQuerySchema> = {}) {
  const axios = useAxiosAuth();
  const api = albumsApi(axios);

  const [data, setData] = useState<AlbumListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<Partial<AlbumQuerySchema>>({
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
      const msg = err?.response?.data?.message ?? "Failed to load albums";
      setError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  function updateQuery(updates: Partial<AlbumQuerySchema>) {
    setQuery((prev) => ({ ...prev, ...updates, page: 1 }));
  }

  function setPage(page: number) {
    setQuery((prev) => ({ ...prev, page }));
  }

  return { data, loading, error, query, updateQuery, setPage, refetch: fetch };
}
