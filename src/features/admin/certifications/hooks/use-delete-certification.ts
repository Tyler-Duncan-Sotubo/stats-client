"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { certificationsApi } from "../api/certifications.api";

export function useDeleteCertification() {
  const axios = useAxiosAuth();
  const api = certificationsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function deleteCertification(id: string) {
    setLoading(true);
    try {
      await api.delete(id);
      toast.success("Certification deleted");
      router.push("/admin/certifications");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to delete certification";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  return { deleteCertification, loading };
}
