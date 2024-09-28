import { z } from 'zod';

export const userSignupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    createdByUserId: z.string().uuid().optional(),
    updatedByUserId: z.string().uuid().optional(),
  })
  .strict();

export const userSigninSchema = userSignupSchema
  .pick({
    email: true,
    password: true,
  })
  .strict();

export type UserSignupDto = z.infer<typeof userSignupSchema>;
export type UserSigninDto = z.infer<typeof userSigninSchema>;

export type UserDto = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: {
    id?: string;
    name: string;
    description: string;
  };
};

export type AuthPayload = {
  sub: string;
  email: string;
  name: string;
  family_name: string;
  role?: string;
};

export const tokenInformationSchema = z
  .object({
    access_token: z.string(),
    refresh_token: z.string(),
  })
  .strict();

export type TokenInformation = z.infer<typeof tokenInformationSchema>;
