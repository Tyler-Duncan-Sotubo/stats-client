import { z } from "zod";

export const createRecordSchema = z.object({
  artistId: z.string().uuid().optional(),
  songId: z.string().uuid().optional(),
  albumId: z.string().uuid().optional(),
  recordType: z.string().min(1, "Record type is required"),
  recordValue: z.string().min(1, "Record value is required"),
  numericValue: z.number().optional(),
  scope: z.string().min(1, "Scope is required"),
  isActive: z.boolean().default(true),
  setOn: z.string().optional(),
  brokenOn: z.string().optional(),
  notes: z.string().optional(),
});

export const breakRecordSchema = z.object({
  brokenOn: z.string().min(1, "Broken on date is required"),
  notes: z.string().optional(),
});

export const recordQuerySchema = z.object({
  artistId: z.string().optional(),
  songId: z.string().optional(),
  recordType: z.string().optional(),
  scope: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().default(1),
  limit: z.number().default(20),
});

export type CreateRecordSchema = z.infer<typeof createRecordSchema>;
export type CreateRecordSchemaInput = z.input<typeof createRecordSchema>;
export type UpdateRecordSchema = Partial<CreateRecordSchema>;
export type BreakRecordSchema = z.infer<typeof breakRecordSchema>;
export type RecordQuerySchema = z.infer<typeof recordQuerySchema>;
