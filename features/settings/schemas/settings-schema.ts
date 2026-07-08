import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120, "Nama maksimal 120 karakter"),
  email: z.string().email("Email tidak valid").toLowerCase(),
  image: z.string().url("Image harus berupa URL valid").or(z.literal("")).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
