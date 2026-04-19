"use client";

import { useEffect, useState } from "react";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";

export interface ArtistNeedsReview {
  id: string;
  name: string;
  slug: string;
  originCountry: string | null;
  entityStatus: string;
  createdAt: string;
}

export function useNeedsReview() {
  const axios = useAxiosAuth();
  const [artists, setArtists] = useState<ArtistNeedsReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          "/api/artists?needsReview=true&limit=10",
        );
        setArtists(data.data);
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Failed to load";
        setError(Array.isArray(msg) ? msg[0] : msg);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, []);

  return { artists, loading, error };
}
