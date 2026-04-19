"use client";

import { useEffect, useState } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";

export interface AdminStats {
  totalArtists: number;
  totalSongs: number;
  totalAlbums: number;
  totalCertifications: number;
  totalAwards: number;
  totalRecords: number;
  needsReview: number;
}

export function useAdminStats() {
  const axios = useAxiosAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);

      try {
        const [artists, songs, albums, certifications, awards, records] =
          await Promise.all([
            axios.get("/api/artists?limit=1"),
            axios.get("/api/songs?limit=1"),
            axios.get("/api/albums?limit=1"),
            axios.get("/api/certifications?limit=1"),
            axios.get("/api/awards?limit=1"),
            axios.get("/api/records?limit=1"),
          ]);

        const needsReview = await axios.get(
          "/api/artists?needsReview=true&limit=1",
        );

        setStats({
          totalArtists: artists.data.meta.total,
          totalSongs: songs.data.meta.total,
          totalAlbums: albums.data.meta.total,
          totalCertifications: certifications.data.meta.total,
          totalAwards: awards.data.meta.total,
          totalRecords: records.data.meta.total,
          needsReview: needsReview.data.meta.total,
        });
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Failed to load stats";
        setError(Array.isArray(msg) ? msg[0] : msg);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, []);

  return { stats, loading, error };
}
