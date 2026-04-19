import { z } from "zod";

export const createAlbumSchema = z.object({
  artistId: z.string().uuid("Must be a valid artist ID"),
  title: z.string().min(1, "Title is required"),
  spotifyAlbumId: z.string().min(1, "Spotify album ID is required"),
  albumType: z.enum(["album", "single", "ep", "compilation"]).default("album"),
  releaseDate: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  totalTracks: z.number().min(1).optional(),
  isAfrobeats: z.boolean().default(false),
});

export const updateAlbumSchema = createAlbumSchema.partial();

export const albumQuerySchema = z.object({
  search: z.string().optional(),
  artistId: z.string().optional(),
  albumType: z.string().optional(),
  isAfrobeats: z.boolean().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

export type CreateAlbumSchema = z.infer<typeof createAlbumSchema>;
export type CreateAlbumSchemaInput = z.input<typeof createAlbumSchema>;
export type UpdateAlbumSchema = z.infer<typeof updateAlbumSchema>;
export type AlbumQuerySchema = z.infer<typeof albumQuerySchema>;
