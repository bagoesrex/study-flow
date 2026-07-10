import { z } from "zod";

export const aiStudyPlanDifficultySchema = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export const generateStudyPlanSchema = z.object({
  subjectId: z.string().uuid("Subject tidak valid"),
  goal: z.string().min(10, "Goal minimal 10 karakter").max(1000, "Goal maksimal 1000 karakter"),
  difficulty: aiStudyPlanDifficultySchema.default("BEGINNER"),
  deadlineDays: z.coerce
    .number()
    .int("Deadline harus angka bulat")
    .min(1, "Deadline minimal 1 hari")
    .max(365, "Deadline maksimal 365 hari"),
  availableHoursPerDay: z.coerce
    .number()
    .min(0.5, "Minimal 0.5 jam per hari")
    .max(24, "Maksimal 24 jam per hari"),
  additionalNotes: z
    .string()
    .max(1000, "Catatan tambahan maksimal 1000 karakter")
    .optional()
    .or(z.literal("")),
  isCodingRelated: z.boolean().default(false),
});

export const generatedTaskSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  position: z.number().int().min(0),
});

export const generatedStudyPlanSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().nullable(),
  goal: z.string().min(3).max(1000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  estimatedHours: z.number().int().min(1).max(1000).nullable(),
  tasks: z.array(generatedTaskSchema).min(1).max(30),
});

export const saveGeneratedStudyPlanSchema = z.object({
  subjectId: z.string().uuid("Subject tidak valid"),
  generatedPlan: generatedStudyPlanSchema,
});

export type GenerateStudyPlanInput = z.infer<typeof generateStudyPlanSchema>;
export type SaveGeneratedStudyPlanInput = z.infer<typeof saveGeneratedStudyPlanSchema>;
