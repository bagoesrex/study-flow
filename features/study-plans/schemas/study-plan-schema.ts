import { z } from "zod";

export const studyPlanStatusSchema = z.enum([
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
  "PAUSED",
  "CANCELLED",
]);

export const studyPlanPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const studyPlanSchema = z.object({
  subjectId: z.string().uuid("Subject tidak valid"),
  title: z
    .string()
    .min(3, "Judul study plan minimal 3 karakter")
    .max(180, "Judul study plan maksimal 180 karakter"),
  description: z.string().max(700, "Deskripsi maksimal 700 karakter").optional().or(z.literal("")),
  goal: z.string().max(700, "Goal maksimal 700 karakter").optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  status: studyPlanStatusSchema.default("NOT_STARTED"),
  priority: studyPlanPrioritySchema.default("MEDIUM"),
  estimatedHours: z.coerce
    .number()
    .int("Estimasi jam harus angka bulat")
    .min(1, "Estimasi jam minimal 1")
    .max(1000, "Estimasi jam maksimal 1000")
    .optional()
    .or(z.literal("")),
});

export const updateStudyPlanSchema = studyPlanSchema.extend({
  id: z.string().uuid("ID study plan tidak valid"),
});

export const deleteStudyPlanSchema = z.object({
  id: z.string().uuid("ID study plan tidak valid"),
});

export type StudyPlanInput = z.infer<typeof studyPlanSchema>;
export type UpdateStudyPlanInput = z.infer<typeof updateStudyPlanSchema>;
export type DeleteStudyPlanInput = z.infer<typeof deleteStudyPlanSchema>;
