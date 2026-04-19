import { z } from "zod";

export const createSongSchema = z.object({
  artistId: z.string().uuid("Must be a valid artist ID"),
  albumId: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  spotifyTrackId: z.string().optional(),
  releaseDate: z.string().optional(),
  durationMs: z.number().optional(),
  explicit: z.boolean().default(false),
  isAfrobeats: z.boolean().default(false),
  imageUrl: z.string().url().optional().or(z.literal("")),
  entityStatus: z
    .enum(["canonical", "provisional", "merged", "rejected"])
    .default("canonical"),
  sourceOfTruth: z
    .enum(["spotify", "kworb", "billboard", "official_charts", "manual"])
    .optional(),
});

export const updateSongSchema = createSongSchema.partial().extend({
  needsReview: z.boolean().optional(),
  mergedIntoSongId: z.string().uuid().optional(),
});

export const songQuerySchema = z.object({
  search: z.string().optional(),
  artistId: z.string().optional(),
  isAfrobeats: z.boolean().optional(),
  entityStatus: z.string().optional(),
  needsReview: z.boolean().optional(),
  explicit: z.boolean().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

export const mergeSongSchema = z.object({
  targetSongId: z.string().uuid("Must be a valid song ID"),
});

export const createSongAliasSchema = z.object({
  alias: z.string().min(1, "Alias is required"),
  isPrimary: z.boolean(),
  source: z
    .enum(["billboard", "official_charts", "kworb", "manual"])
    .optional(),
});

export const createSongExternalIdSchema = z.object({
  source: z.enum(["spotify", "isrc", "kworb", "apple_music"]),
  externalId: z.string().min(1, "External ID is required"),
  externalUrl: z.string().url().optional().or(z.literal("")),
});

export const createSongFeatureSchema = z.object({
  featuredArtistId: z.string().uuid("Must be a valid artist ID"),
});

export type CreateSongSchema = z.infer<typeof createSongSchema>;
export type CreateSongSchemaInput = z.input<typeof createSongSchema>;
export type UpdateSongSchema = z.infer<typeof updateSongSchema>;
export type SongQuerySchema = z.infer<typeof songQuerySchema>;
export type MergeSongSchema = z.infer<typeof mergeSongSchema>;
export type CreateSongAliasSchema = z.infer<typeof createSongAliasSchema>;
export type CreateSongExternalIdSchema = z.infer<
  typeof createSongExternalIdSchema
>;
export type CreateSongFeatureSchema = z.infer<typeof createSongFeatureSchema>;
