import { z } from 'zod';

export const userSchema = z
  .object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  })
  .strict();

export const updateUserSchema = userSchema
  .pick({
    email: true,
    firstName: true,
    lastName: true,
  })
  .strict()
  .partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
