import { z } from "zod";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(4, "Password must be at least 4 characters long");

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export const signUpFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
