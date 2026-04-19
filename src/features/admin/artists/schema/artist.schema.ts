import { z } from "zod";

export const createArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  spotifyId: z.string().optional(),
  originCountry: z.string().optional(),
  debutYear: z.number().min(1900),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isAfrobeats: z.boolean().default(false),
  isAfrobeatsOverride: z.boolean().default(false),
  bio: z.string().optional(),
  entityStatus: z
    .enum(["canonical", "provisional", "merged", "rejected"])
    .default("canonical"),
  sourceOfTruth: z
    .enum(["spotify", "kworb", "billboard", "official_charts", "manual"])
    .optional(),
});

export type CreateArtistSchemaInput = z.input<typeof createArtistSchema>;

export const updateArtistSchema = createArtistSchema.partial().extend({
  needsReview: z.boolean().optional(),
  mergedIntoArtistId: z.string().uuid().optional(),
});

export const artistQuerySchema = z.object({
  search: z.string().optional(),
  originCountry: z.string().optional(),
  isAfrobeats: z.boolean().optional(),
  entityStatus: z.string().optional(),
  needsReview: z.boolean().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

export const mergeArtistSchema = z.object({
  targetArtistId: z.string().uuid("Must be a valid artist ID"),
});

export const createAliasSchema = z.object({
  alias: z.string().min(1, "Alias is required"),
  isPrimary: z.boolean(),
  source: z
    .enum(["billboard", "official_charts", "riaa", "kworb", "manual"])
    .optional(),
});

export const createGenreSchema = z.object({
  genre: z.string().min(1, "Genre is required"),
  isPrimary: z.boolean(),
});

export const createExternalIdSchema = z.object({
  source: z.enum(["spotify", "kworb", "musicbrainz", "apple_music"]),
  externalId: z.string().min(1, "External ID is required"),
  externalUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateArtistSchema = z.infer<typeof createArtistSchema>;
export type UpdateArtistSchema = z.infer<typeof updateArtistSchema>;
export type ArtistQuerySchema = z.infer<typeof artistQuerySchema>;
export type MergeArtistSchema = z.infer<typeof mergeArtistSchema>;
export type CreateAliasSchema = z.infer<typeof createAliasSchema>;
export type CreateGenreSchema = z.infer<typeof createGenreSchema>;
export type CreateExternalIdSchema = z.infer<typeof createExternalIdSchema>;
