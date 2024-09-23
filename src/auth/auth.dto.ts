import { z } from 'zod';

export const userSignupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .strict();

export const userSigninSchema = userSignupSchema
  .pick({
    email: true,
    password: true,
  })
  .strict();

export type UserSignupSchema = z.infer<typeof userSignupSchema>;
export type UserSigninSchema = z.infer<typeof userSigninSchema>;
