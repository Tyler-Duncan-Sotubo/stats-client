"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { albumsApi } from "../api/albums.api";

export function useDeleteAlbum() {
  const axios = useAxiosAuth();
  const api = albumsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteAlbum(id: string, title: string) {
    setLoading(true);
    try {
      await api.delete(id);
      toast.success(`Album "${title}" deleted`);
      router.push("/admin/albums");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete album";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return { deleteAlbum, loading };
}
