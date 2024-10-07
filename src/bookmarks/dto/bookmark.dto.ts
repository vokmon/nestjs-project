import { z } from 'zod';

export const createBookmarkSchema = z.object({
  name: z.string(),
  link: z.string().url(),
  description: z.string().optional(),
}).strict();

export const updateBookmarkSchema = createBookmarkSchema.partial();

export type CreateBookmarkDto = z.infer<typeof createBookmarkSchema>;
export type UpdateBookmarkDto = z.infer<typeof updateBookmarkSchema>;