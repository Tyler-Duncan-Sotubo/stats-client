"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAxiosAuth from "@/shared/hooks/use-axios-auth";
import { certificationsApi } from "../api/certifications.api";
import type {
  CreateCertificationSchema,
  CreateCertificationSchemaInput,
} from "../schema/certification.schema";

export function useCreateCertification() {
  const axios = useAxiosAuth();
  const api = certificationsApi(axios);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createCertification(payload: CreateCertificationSchemaInput) {
    setLoading(true);
    setError(null);
    try {
      const cert = await api.create(payload as CreateCertificationSchema);
      toast.success(`Certification created`);
      router.push(`/admin/certifications/${cert.id}`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to create certification";
      const formatted = Array.isArray(msg) ? msg[0] : msg;
      setError(formatted);
      toast.error(formatted);
    } finally {
      setLoading(false);
    }
  }

  return { createCertification, loading, error };
}
