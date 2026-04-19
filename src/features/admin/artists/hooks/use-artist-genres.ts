"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { artistsApi } from "../api/artists.api";
import type { CreateGenreSchema } from "../schema/artist.schema";

export function useArtistGenres(artistId: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = artistsApi(axios);
  const [loading, setLoading] = useState(false);

  async function addGenre(payload: CreateGenreSchema) {
    setLoading(true);
    try {
      await api.addGenre(artistId, payload);
      toast.success("Genre added");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to add genre";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  async function setPrimary(genreId: string) {
    setLoading(true);
    try {
      await api.setPrimaryGenre(artistId, genreId);
      toast.success("Primary genre updated");
      onSuccess?.();
    } catch (err: any) {
      toast.error("Failed to update primary genre");
    } finally {
      setLoading(false);
    }
  }

  async function deleteGenre(genreId: string) {
    setLoading(true);
    try {
      await api.deleteGenre(artistId, genreId);
      toast.success("Genre removed");
      onSuccess?.();
    } catch (err: any) {
      toast.error("Failed to remove genre");
    } finally {
      setLoading(false);
    }
  }

  return { addGenre, setPrimary, deleteGenre, loading };
}
