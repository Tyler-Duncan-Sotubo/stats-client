"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { artistsApi } from "../api/artists.api";

export function useDeleteArtist() {
  const axios = useAxiosAuth();
  const api = artistsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteArtist(id: string, name: string) {
    setLoading(true);
    try {
      await api.delete(id);
      toast.success(`Artist "${name}" deleted`);
      router.push("/admin/artists");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete artist";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return { deleteArtist, loading };
}
