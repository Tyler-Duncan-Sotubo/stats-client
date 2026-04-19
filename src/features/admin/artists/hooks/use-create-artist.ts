"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { artistsApi } from "../api/artists.api";
import type { CreateArtistSchema } from "../schema/artist.schema";

export function useCreateArtist() {
  const axios = useAxiosAuth();
  const api = artistsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createArtist(payload: CreateArtistSchema) {
    setLoading(true);
    setError(null);
    try {
      const artist = await api.create(payload);
      toast.success(`Artist "${artist.name}" created`);
      router.push(`/admin/artists/${artist.id}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to create artist";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { createArtist, loading, error };
}
