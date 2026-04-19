"use client";

import { useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { artistsApi } from "../api/artists.api";
import type { CreateAliasSchema } from "../schema/artist.schema";

export function useArtistAliases(artistId: string, onSuccess?: () => void) {
  const axios = useAxiosAuth();
  const api = artistsApi(axios);
  const [loading, setLoading] = useState(false);

  async function addAlias(payload: CreateAliasSchema) {
    setLoading(true);
    try {
      await api.addAlias(artistId, payload);
      toast.success("Alias added");
      onSuccess?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to add alias";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  async function setPrimary(aliasId: string) {
    setLoading(true);
    try {
      await api.setPrimaryAlias(artistId, aliasId);
      toast.success("Primary alias updated");
      onSuccess?.();
    } catch (err: any) {
      toast.error("Failed to update primary alias");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAlias(aliasId: string) {
    setLoading(true);
    try {
      await api.deleteAlias(artistId, aliasId);
      toast.success("Alias removed");
      onSuccess?.();
    } catch (err: any) {
      toast.error("Failed to remove alias");
    } finally {
      setLoading(false);
    }
  }

  return { addAlias, setPrimary, deleteAlias, loading };
}
