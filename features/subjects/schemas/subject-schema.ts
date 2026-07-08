import { z } from "zod";

export const subjectSchema = z.object({
  name: z
    .string()
    .min(2, "Nama subject minimal 2 karakter")
    .max(120, "Nama subject maksimal 120 karakter"),
  description: z.string().max(500, "Deskripsi maksimal 500 karakter").optional().or(z.literal("")),
  color: z
    .string()
    .min(1, "Warna wajib dipilih")
    .max(20, "Format warna terlalu panjang")
    .default("#4F46E5"),
  targetHours: z.coerce
    .number()
    .int("Target jam harus berupa angka bulat")
    .min(1, "Target jam minimal 1")
    .max(1000, "Target jam maksimal 1000")
    .optional()
    .or(z.literal("")),
});

export const updateSubjectSchema = subjectSchema.extend({
  id: z.string().uuid("ID subject tidak valid"),
});

export const deleteSubjectSchema = z.object({
  id: z.string().uuid("ID subject tidak valid"),
});

export type SubjectInput = z.infer<typeof subjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
export type DeleteSubjectInput = z.infer<typeof deleteSubjectSchema>;
