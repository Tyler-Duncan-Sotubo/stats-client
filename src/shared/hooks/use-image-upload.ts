"use client";
import { useState } from "react";
import useAxiosAuth from "./use-axios-auth";

export type MediaFolder = "needs" | "users" | "offers";

export interface UploadedImage {
  id: string;
  url: string;
  storageKey: string;
  fileName: string;
}

/**
 * useImageUpload — reusable hook for the presign → S3 → finalize flow.
 *
 * Works for any entity type:
 *   folder: 'needs',  entityId: needId   → need images
 *   folder: 'users',  entityId: userId   → user avatar
 *   folder: 'offers', entityId: offerId  → offer images
 *
 * Usage:
 *   const { upload, uploading } = useImageUpload();
 *   const image = await upload({ folder: 'users', entityId: userId, file });
 */

export function useImageUpload() {
  const axios = useAxiosAuth(); // for presign + finalize
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(params: {
    folder: MediaFolder;
    entityId: string;
    file: File;
  }): Promise<UploadedImage | null> {
    const { folder, entityId, file } = params;

    setUploading(true);
    setError(null);

    try {
      // Step 1 — presign via our API (needs auth)
      const { data: presign } = await axios.post("/api/media/presign", {
        folder,
        entityId,
        fileName: file.name,
        mimeType: file.type,
      });

      // Step 2 — PUT directly to S3
      // Use plain fetch — NOT useAxiosAuth
      // The presigned URL is self-authenticating via query string.
      // Sending an Authorization header alongside it causes
      // SignatureDoesNotMatch from S3.
      await fetch(presign.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // Step 3 — finalize via our API (needs auth)
      const { data: image } = await axios.post("/api/media/finalize", {
        folder,
        entityId,
        key: presign.key,
        publicUrl: presign.publicUrl,
        mimeType: file.type,
      });

      return {
        id: image.id,
        url: image.url,
        storageKey: image.storageKey,
        fileName: file.name,
      };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Upload failed";
      setError(msg);
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function uploadMany(params: {
    folder: MediaFolder;
    entityId: string;
    files: File[];
  }): Promise<UploadedImage[]> {
    const results: UploadedImage[] = [];

    for (const file of params.files) {
      const result = await upload({
        folder: params.folder,
        entityId: params.entityId,
        file,
      });
      if (result) results.push(result);
    }

    return results;
  }

  return { upload, uploadMany, uploading, error };
}
