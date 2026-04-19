import { z } from "zod";

export const createAwardSchema = z.object({
  artistId: z.string().uuid().optional(),
  songId: z.string().uuid().optional(),
  albumId: z.string().uuid().optional(),
  awardBody: z.string().min(1, "Award body is required"),
  awardName: z.string().min(1, "Award name is required"),
  category: z.string().min(1, "Category is required"),
  result: z.enum(["won", "nominated"]),
  year: z.number().min(1900).max(new Date().getFullYear()),
  ceremony: z.string().optional(),
  territory: z.string().optional(),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const awardQuerySchema = z.object({
  artistId: z.string().optional(),
  awardBody: z.string().optional(),
  category: z.string().optional(),
  result: z.string().optional(),
  territory: z.string().optional(),
  year: z.number().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

export type CreateAwardSchema = z.infer<typeof createAwardSchema>;
export type CreateAwardSchemaInput = z.input<typeof createAwardSchema>;
export type UpdateAwardSchema = Partial<CreateAwardSchema>;
export type AwardQuerySchema = z.infer<typeof awardQuerySchema>;
