import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid").toLowerCase(),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid").toLowerCase(),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
