import { z } from "zod";

export const createCertificationSchema = z.object({
  artistId: z.string().uuid().optional(),
  songId: z.string().uuid().optional(),
  albumId: z.string().uuid().optional(),
  territory: z.string().min(1, "Territory is required"),
  body: z.string().min(1, "Body is required"),
  title: z.string().min(1, "Title is required"),
  level: z.enum(["diamond", "platinum", "gold", "silver"]),
  units: z.number().min(0).optional(),
  certifiedAt: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  rawArtistName: z.string().optional(),
  rawTitle: z.string().optional(),
  resolutionStatus: z
    .enum(["matched", "artist_only", "unresolved"])
    .default("matched"),
});

export const certificationQuerySchema = z.object({
  artistId: z.string().optional(),
  songId: z.string().optional(),
  territory: z.string().optional(),
  body: z.string().optional(),
  level: z.string().optional(),
  resolutionStatus: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

export type CreateCertificationSchema = z.infer<
  typeof createCertificationSchema
>;
export type CreateCertificationSchemaInput = z.input<
  typeof createCertificationSchema
>;
export type UpdateCertificationSchema = Partial<CreateCertificationSchema>;
export type CertificationQuerySchema = z.infer<typeof certificationQuerySchema>;
